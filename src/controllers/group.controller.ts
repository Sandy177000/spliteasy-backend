import _ from 'lodash';
import { Request, Response } from 'express';
import { getPrismaClient } from '../prisma/client';

export interface GroupResponseBody {
    id: string,
    name: string,
    members: string[],
    description: string | null,
    createdAt: string,
    createdBy: string,
    totalBalance: number,
    currency: string | null,
    imageUrl: string | null
}

const prismaClient = getPrismaClient();

interface CreateGroupRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
    body: {
        name: string;
        description?: string;
        currency?: string;
        imageUrl?: string;
    };
}

export const createGroup = async (req: CreateGroupRequest, res: Response<GroupResponseBody | { error: string }>) => {
    try {
        const { name } = req.body;
        const createdBy = req.user?.userId;

        if (!name || !createdBy) {
            return res.status(400).json({ error: 'Name and authentication are required.' });
        }

        const members = [createdBy];
        const group = await prismaClient.group.create({
            data: {
                name,
                members,
                createdBy,
            },
        });

        const response: GroupResponseBody = {
            id: group.id,
            name: group.name,
            members: group.members,
            description: group.description ?? null,
            createdAt: group.createdAt instanceof Date ? group.createdAt.toISOString() : group.createdAt,
            createdBy: group.createdBy,
            totalBalance: group.totalBalance ?? 0,
            currency: group.currency ?? null,
            imageUrl: group.imageUrl ?? null,
        };

        console.log(response)
        return res.status(201).json(response);
    } catch (error: any) {
        console.error('Create group error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

export const getGroupsOfUser = async (req: Request, res: Response<GroupResponseBody[] | { error: string }>) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        const groups = await prismaClient.group.findMany({
            where: {
                members: {
                    has: userId
                }
            }
        });
        const response: GroupResponseBody[] = groups.map(group => ({
            id: group.id,
            name: group.name,
            members: group.members,
            description: group.description ?? null,
            createdAt: group.createdAt instanceof Date ? group.createdAt.toISOString() : group.createdAt,
            createdBy: group.createdBy,
            totalBalance: group.totalBalance ?? 0,
            currency: group.currency ?? null,
            imageUrl: group.imageUrl ?? null,
        }));
        return res.status(200).json(response);
    } catch (error: any) {
        console.error('Get groups of user error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}