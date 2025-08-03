import { Test } from '../models';
import { TestInput, TestUpdateInput } from '../schemas/validation';
import { Test as TestType } from '../types';

export class TestService {
  async getAllTests(): Promise<TestType[]> {
    try {
      const tests = await Test.find().sort({ category: 1, name: 1 });
      return tests.map(test => test.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch tests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTestById(id: string): Promise<TestType | null> {
    try {
      const test = await Test.findById(id);
      return test ? test.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch test: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createTest(testData: TestInput): Promise<TestType> {
    try {
      const test = new Test(testData);
      const savedTest = await test.save();
      return savedTest.toJSON();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Test with this name already exists');
      }
      throw new Error(`Failed to create test: ${error.message || 'Unknown error'}`);
    }
  }

  async updateTest(id: string, updateData: TestUpdateInput): Promise<TestType> {
    try {
      const test = await Test.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!test) {
        throw new Error('Test not found');
      }

      return test.toJSON();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Test with this name already exists');
      }
      throw new Error(`Failed to update test: ${error.message || 'Unknown error'}`);
    }
  }

  async deleteTest(id: string): Promise<void> {
    try {
      const test = await Test.findByIdAndDelete(id);
      if (!test) {
        throw new Error('Test not found');
      }
    } catch (error) {
      throw new Error(`Failed to delete test: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchTests(searchTerm: string): Promise<TestType[]> {
    try {
      const tests = await Test.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      }).sort({ category: 1, name: 1 });

      return tests.map(test => test.toJSON());
    } catch (error) {
      throw new Error(`Failed to search tests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTestsByCategory(category: string): Promise<TestType[]> {
    try {
      const tests = await Test.find({ 
        category: { $regex: category, $options: 'i' } 
      }).sort({ name: 1 });

      return tests.map(test => test.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch tests by category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTestsByIds(testIds: string[]): Promise<TestType[]> {
    try {
      const tests = await Test.find({ _id: { $in: testIds } });
      return tests.map(test => test.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch tests by IDs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTestCategories(): Promise<string[]> {
    try {
      const categories = await Test.distinct('category');
      return categories.sort();
    } catch (error) {
      throw new Error(`Failed to fetch test categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new TestService(); 