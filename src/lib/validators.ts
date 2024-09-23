import { z } from 'zod';
import { ExpenseType } from '@prisma/client';


export const addExpenseValidator = z.object({
    type: z.nativeEnum(ExpenseType),
    spending: z.number(),
    date: z.preprocess((arg) => {
        if (typeof arg === 'string') {
            const date = new Date(arg);
            return new Date(date.toISOString());
        }
        return arg;
    }, z.date()),
    hasContirbutor: z.boolean(),
    contributor: z.string().optional(),
    contirbutionAmount: z.number().optional(),
})

export type AddExpensePayload = z.infer<typeof addExpenseValidator>
