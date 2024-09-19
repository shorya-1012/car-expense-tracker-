import { z } from 'zod';
import { ExpenseType } from '@prisma/client';


export const addExpenseValidator = z.object({
    type: z.nativeEnum(ExpenseType),
    spending: z.number(),
    date: z.preprocess((arg) => {
        if (typeof arg === 'string') {
            return new Date(arg);
        }
        return arg;
    }, z.date()),
})

export type AddExpensePayload = z.infer<typeof addExpenseValidator>
