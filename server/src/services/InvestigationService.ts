import mongoose from 'mongoose';
import { Investigation, Patient, Doctor, Test } from '../models';
import { InvestigationInput, InvestigationUpdateInput, MoveInvestigationInput, InvestigationQuery } from '../schemas/validation';
import { Investigation as InvestigationType, PaginatedResponse } from '../types';

export class InvestigationService {
  async getAllInvestigations(query: InvestigationQuery = { page: 1, limit: 10 }): Promise<InvestigationType[]> {
    try {
      const filter: any = {};

      // Apply filters
      if (query.status && query.status.length > 0) {
        filter.status = { $in: query.status };
      }

      if (query.priority && query.priority.length > 0) {
        filter.priority = { $in: query.priority };
      }

      if (query.patientId) {
        filter.patientId = query.patientId;
      }

      if (query.doctorId) {
        filter.doctorId = query.doctorId;
      }

      if (query.testId) {
        filter.testIds = { $in: [query.testId] };
      }

      // Date range filter
      if (query.startDate || query.endDate) {
        filter.createdAt = {};
        if (query.startDate) {
          filter.createdAt.$gte = new Date(query.startDate);
        }
        if (query.endDate) {
          filter.createdAt.$lte = new Date(query.endDate);
        }
      }

      let investigations = await Investigation
        .find(filter)
        .populate('patient')
        .populate('doctor')
        .populate('tests')
        .sort({ status: 1, order: 1 });

      // Apply search filter (after population for better performance)
      if (query.search) {
        const searchTerm = query.search.toLowerCase();
        investigations = investigations.filter(inv => {
          const investigationObj = inv.toJSON() as any;
          return (
            investigationObj.id.toLowerCase().includes(searchTerm) ||
            (investigationObj.patient?.name?.toLowerCase().includes(searchTerm)) ||
            (investigationObj.doctor?.name?.toLowerCase().includes(searchTerm)) ||
            (investigationObj.tests?.some((test: any) => test.name.toLowerCase().includes(searchTerm)))
          );
        });
      }

      return investigations.map(inv => this.populateInvestigation(inv));
    } catch (error) {
      throw new Error(`Failed to fetch investigations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvestigationById(id: string): Promise<InvestigationType | null> {
    try {
      const investigation = await Investigation
        .findById(id)
        .populate('patient')
        .populate('doctor')
        .populate('tests');

      return investigation ? this.populateInvestigation(investigation) : null;
    } catch (error) {
      throw new Error(`Failed to fetch investigation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createInvestigation(investigationData: InvestigationInput): Promise<InvestigationType> {
    try {
      // Validate references exist
      const patient = await Patient.findById(investigationData.patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      const doctor = await Doctor.findById(investigationData.doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      const tests = await Test.find({ _id: { $in: investigationData.testIds } });
      if (tests.length !== investigationData.testIds.length) {
        throw new Error('One or more tests not found');
      }

      const investigation = new Investigation({
        ...investigationData,
        status: 'New Investigations',
      });

      const savedInvestigation = await investigation.save();

      // Populate and return
      const populatedInvestigation = await Investigation
        .findById(savedInvestigation._id)
        .populate('patient')
        .populate('doctor')
        .populate('tests');

      return this.populateInvestigation(populatedInvestigation!);
    } catch (error: any) {
      throw new Error(`Failed to create investigation: ${error.message || 'Unknown error'}`);
    }
  }

  async updateInvestigation(id: string, updateData: InvestigationUpdateInput): Promise<InvestigationType> {
    try {
      // If testIds are being updated, recalculate total amount
      if (updateData.testIds) {
        const tests = await Test.find({ _id: { $in: updateData.testIds } });
        if (tests.length !== updateData.testIds.length) {
          throw new Error('One or more tests not found');
        }
      }

      const investigation = await Investigation.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { 
          new: true, 
          runValidators: true 
        }
      )
      .populate('patient')
      .populate('doctor')
      .populate('tests');

      if (!investigation) {
        throw new Error('Investigation not found');
      }

      return this.populateInvestigation(investigation);
    } catch (error: any) {
      throw new Error(`Failed to update investigation: ${error.message || 'Unknown error'}`);
    }
  }

  async moveInvestigation(id: string, moveData: MoveInvestigationInput): Promise<InvestigationType> {
    const session = await mongoose.startSession();
    
    try {
      return await session.withTransaction(async () => {
        const investigation = await Investigation.findById(id).session(session);
        if (!investigation) {
          throw new Error('Investigation not found');
        }

        const statusMap: Record<string, string> = {
          'advised': 'Advised',
          'billing': 'Billing',
          'new-investigations': 'New Investigations',
          'in-progress': 'In Progress',
          'under-review': 'Under Review',
          'approved': 'Approved',
          'revision-required': 'Revision Required'
        };

        const newStatus = statusMap[moveData.newStatus] || moveData.newStatus;
        const oldStatus = investigation.status;
        const { newIndex } = moveData;

        // Get all investigations in the target status
        const targetStatusInvestigations = await Investigation
          .find({ 
            _id: { $ne: id }, 
            status: newStatus 
          })
          .sort({ order: 1 })
          .session(session);

        let newOrder: number;

        if (targetStatusInvestigations.length === 0) {
          // First item in the status
          newOrder = 1;
        } else if (newIndex === 0) {
          // Insert at the beginning
          newOrder = targetStatusInvestigations[0].order - 1;
        } else if (newIndex >= targetStatusInvestigations.length) {
          // Insert at the end
          newOrder = targetStatusInvestigations[targetStatusInvestigations.length - 1].order + 1;
        } else {
          // Insert between two items
          const prevOrder = targetStatusInvestigations[newIndex - 1].order;
          const nextOrder = targetStatusInvestigations[newIndex].order;
          newOrder = (prevOrder + nextOrder) / 2;
        }

        // Update the moved investigation
        await Investigation.updateOne(
          { _id: id },
          { 
            status: newStatus,
            order: newOrder,
            updatedAt: new Date()
          },
          { session }
        );

        // If status changed, reorder investigations in the old status
        if (oldStatus !== newStatus) {
          const oldStatusInvestigations = await Investigation
            .find({ status: oldStatus })
            .sort({ order: 1 })
            .session(session);

          // Reassign order values sequentially for the old status
          for (let i = 0; i < oldStatusInvestigations.length; i++) {
            await Investigation.updateOne(
              { _id: oldStatusInvestigations[i]._id },
              { order: i + 1, updatedAt: new Date() },
              { session }
            );
          }
        }

        // Get the updated investigation with populated data
        const updatedInvestigation = await Investigation
          .findById(id)
          .populate('patient')
          .populate('doctor')
          .populate('tests')
          .session(session);

        return this.populateInvestigation(updatedInvestigation!);
      });
    } catch (error: any) {
      throw new Error(`Failed to move investigation: ${error.message || 'Unknown error'}`);
    } finally {
      await session.endSession();
    }
  }

  async deleteInvestigation(id: string): Promise<void> {
    try {
      const investigation = await Investigation.findByIdAndDelete(id);
      if (!investigation) {
        throw new Error('Investigation not found');
      }

      // Reorder remaining investigations in the same status
      const remainingInvestigations = await Investigation
        .find({ status: investigation.status })
        .sort({ order: 1 });

      for (let i = 0; i < remainingInvestigations.length; i++) {
        await Investigation.updateOne(
          { _id: remainingInvestigations[i]._id },
          { order: i + 1 }
        );
      }
    } catch (error) {
      throw new Error(`Failed to delete investigation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvestigationStats(): Promise<{
    total: number;
    inProgress: number;
    underReview: number;
    approved: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      const [statusStats, priorityStats, totalCount] = await Promise.all([
        Investigation.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Investigation.aggregate([
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]),
        Investigation.countDocuments()
      ]);

      const byStatus: Record<string, number> = {};
      statusStats.forEach(stat => {
        byStatus[stat._id] = stat.count;
      });

      const byPriority: Record<string, number> = {};
      priorityStats.forEach(stat => {
        byPriority[stat._id] = stat.count;
      });

      return {
        total: totalCount,
        inProgress: byStatus['In Progress'] || 0,
        underReview: byStatus['Under Review'] || 0,
        approved: byStatus['Approved'] || 0,
        byStatus,
        byPriority
      };
    } catch (error) {
      throw new Error(`Failed to fetch investigation stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private populateInvestigation(investigation: any): InvestigationType {
    // const investigationObj = investigation.toJSON();
    // return {
    //   ...investigationObj,
    //   patient: investigationObj.patientId,
    //   doctor: investigationObj.doctorId,
    //   tests: investigationObj.testIds,
    //   patientId: typeof investigationObj.patientId === 'object' 
    //     ? investigationObj.patientId.id || investigationObj.patientId._id.toString()
    //     : investigationObj.patientId,
    //   doctorId: typeof investigationObj.doctorId === 'object'
    //     ? investigationObj.doctorId.id || investigationObj.doctorId._id.toString()
    //     : investigationObj.doctorId,
    //   testIds: Array.isArray(investigationObj.testIds)
    //     ? investigationObj.testIds.map((test: any) => 
    //         typeof test === 'object' ? test.id || test._id.toString() : test
    //       )
    //     : investigationObj.testIds
    // };
    return investigation.toJSON();
  }
}

export default new InvestigationService(); 