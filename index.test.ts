import { CalculateDueDate } from './index';

describe('CalculateDueDate', () => {

    test('invalid submit time, outside work hours', () => {
        const submitTime = new Date('2024-03-25 18:00'); // Monday 6 PM
        expect(() => CalculateDueDate(submitTime, 2)).toThrow('Submit time is outside of working hours');
    });

    test('invalid submit day, on a weekend', () => {
        const submitTime = new Date('2024-03-23 10:00'); // Saturday
        expect(() => CalculateDueDate(submitTime, 2)).toThrow('Submit time must be on a workday');
    });

    test('basic same day calculation', () => {
        const submitTime = new Date('2024-03-25 10:00'); // Monday
        const result = CalculateDueDate(submitTime, 2);
        expect(result.getHours()).toBe(12);
        expect(result.getMinutes()).toBe(0);
    });

    test('handles minutes properly', () => {
        const submitTime = new Date('2024-03-25 14:30'); // Monday 2:30 PM
        const result = CalculateDueDate(submitTime, 1);
        expect(result.getHours()).toBe(15);
        expect(result.getMinutes()).toBe(30);
    });

    test('handles 1 extra minute properly', () => {
        const submitTime = new Date('2024-03-25 12:01'); // Monday 12:01 PM
        const result = CalculateDueDate(submitTime, 13);
        expect(result.getHours()).toBe(9);
        expect(result.getMinutes()).toBe(1);
    });

    test('carries over to next day', () => {
        const submitTime = new Date('2024-03-25 16:00'); // Monday 4 PM
        const result = CalculateDueDate(submitTime, 2);
        expect(result.getHours()).toBe(10);
        expect(result.getDate()).toBe(26);
    });

    test('carries over from saturday to monday', () => {
        const submitTime = new Date('2024-03-22 16:21'); // Friday 4:21 PM
        const result = CalculateDueDate(submitTime, 1);
        expect(result.getDate()).toBe(25); // Should be Monday
        expect(result.getHours()).toBe(9);
        expect(result.getMinutes()).toBe(21);
    });

    test('example from problem description', () => {
        const submitTime = new Date('2024-03-19 14:12'); // Tuesday 2:12 PM
        const result = CalculateDueDate(submitTime, 16);
        expect(result.getHours()).toBe(14);
        expect(result.getMinutes()).toBe(12);
        expect(result.getDate()).toBe(21); // Should be Thursday
    });

    test('skips weekend properly', () => {
        const submitTime = new Date('2024-03-22 14:00'); // Friday
        const result = CalculateDueDate(submitTime, 8);
        expect(result.getDate()).toBe(25); // Should be Monday
        expect(result.getHours()).toBe(14);
    });

    test('handles end of day transition', () => {
        const submitTime = new Date('2024-03-25 16:30'); // Monday 4:30 PM
        const result = CalculateDueDate(submitTime, 1);
        expect(result.getHours()).toBe(9);
        expect(result.getMinutes()).toBe(30);
        expect(result.getDate()).toBe(26);
    });

    test('negative turnaround hours throws error', () => {
        const submitTime = new Date('2024-03-25 10:00');
        expect(() => CalculateDueDate(submitTime, -1)).toThrow('Turnaround time cannot be negative');
    });

    test('exactly 9 AM submit time', () => {
        const submitTime = new Date('2024-03-25 09:00'); // Monday 9 AM
        const result = CalculateDueDate(submitTime, 2);
        expect(result.getHours()).toBe(11);
        expect(result.getMinutes()).toBe(0);
    });

    test('exactly 5 PM submit time throws error', () => {
        const submitTime = new Date('2024-03-25 17:00'); // Monday 5 PM
        expect(() => CalculateDueDate(submitTime, 2)).toThrow('Submit time is outside of working hours');
    });

    test('spans multiple weeks', () => {
        const submitTime = new Date('2024-03-25 14:00'); // Monday 2 PM
        const result = CalculateDueDate(submitTime, 45); // 45 hours = 5 working days + 5 hours
        expect(result.getDate()).toBe(2); 
        expect(result.getHours()).toBe(11);
    });

    test('handles month boundary', () => {
        const submitTime = new Date('2024-03-29 15:00'); // Friday 3 PM
        const result = CalculateDueDate(submitTime, 20);
        expect(result.getMonth()).toBe(3); // April
        expect(result.getDate()).toBe(3);
        expect(result.getHours()).toBe(11);
    });

    test('exact 8-hour workday', () => {
        const submitTime = new Date('2024-03-25 09:00'); // Monday 9 AM
        const result = CalculateDueDate(submitTime, 8);
        expect(result.getDate()).toBe(26);
        expect(result.getHours()).toBe(9);
        expect(result.getMinutes()).toBe(0);
    });

    test('handles full work week (40 hours)', () => {
        const submitTime = new Date('2024-03-25 09:00'); // Monday 9 AM
        const result = CalculateDueDate(submitTime, 40);
        expect(result.getMonth()).toBe(3);
        expect(result.getDate()).toBe(1); // Should be Monday
        expect(result.getHours()).toBe(9);
        expect(result.getMinutes()).toBe(0);
    });

    test('handles zero turnaround time', () => {
        const submitTime = new Date('2024-03-25 14:30');
        const result = CalculateDueDate(submitTime, 0);
        expect(result.getTime()).toBe(submitTime.getTime());
    });

    test('submitting right before end of monday', () => {
        const submitTime = new Date('2024-03-25 16:59:59'); // Monday 4:59:59 PM
        const result = CalculateDueDate(submitTime, 1);
        expect(result.getDate()).toBe(26);
        expect(result.getHours()).toBe(9);
        expect(result.getMinutes()).toBe(59);
        expect(result.getSeconds()).toBe(59);
    });
    test('submitting right before end of friday', () => {
        const submitTime = new Date('2024-03-29 16:59:59'); // Monday 4:59:59 PM
        const result = CalculateDueDate(submitTime, 1);
        expect(result.getDate()).toBe(1);
        expect(result.getHours()).toBe(9);
        expect(result.getMinutes()).toBe(59);
        expect(result.getSeconds()).toBe(59);
    });
});