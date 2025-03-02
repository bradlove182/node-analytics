import z from 'zod';

export const urlOrPathParam = z.string().refine(
    value => {
        try {
            new URL (value, 'https://localhost');
            return true;
        }
        catch {
            return false
        }
    },{
        message: "Invalud URL."
    }
)