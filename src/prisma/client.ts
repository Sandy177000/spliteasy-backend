import { PrismaClient } from '@prisma/client';

let prismaCient: PrismaClient;
export const getPrismaClient = () => {
    if(!prismaCient)
        prismaCient = new PrismaClient();
        
    return prismaCient;
}


