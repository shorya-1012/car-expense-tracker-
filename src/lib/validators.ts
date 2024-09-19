import { z } from 'zod';
import { ExpenseType } from '@prisma/client';


export const addExpenseValidator = z.object({
    type: z.nativeEnum(ExpenseType),
    spending: z.number(),
    date: z.preprocess((arg) => {
        if (typeof arg === 'string') {
            // Convert the date to UTC to avoid timezone shifts
            const date = new Date(arg);
            return new Date(date.toISOString()); // Convert to UTC and ensure it's consistent
        }
        return arg;
    }, z.date())
})

export type AddExpensePayload = z.infer<typeof addExpenseValidator>
