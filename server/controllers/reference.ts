import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const referenceController = {
  async getReferences(req: Request, res: Response) {
    try {
      const references = await prisma.reference.findMany({
        where: {
          OR: [
            { fromUserId: req.userId },
            { toUserId: req.userId },
          ],
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              title: true,
              avatar: true,
              linkedin: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json(references);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async createReference(req: Request, res: Response) {
    try {
      const reference = await prisma.reference.create({
        data: {
          ...req.body,
          fromUserId: req.userId,
          status: 'pending',
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              title: true,
              avatar: true,
              linkedin: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json(reference);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getReferenceById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reference = await prisma.reference.findUnique({
        where: { id },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              title: true,
              avatar: true,
              linkedin: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!reference) {
        return res.status(404).json({ message: 'Reference not found' });
      }

      res.json(reference);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async approveReference(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reference = await prisma.reference.findUnique({
        where: { id },
        select: { toUserId: true },
      });

      if (!reference || reference.toUserId !== req.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const updatedReference = await prisma.reference.update({
        where: { id },
        data: { status: 'approved' },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              title: true,
              avatar: true,
              linkedin: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.json(updatedReference);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  async rejectReference(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reference = await prisma.reference.findUnique({
        where: { id },
        select: { toUserId: true },
      });

      if (!reference || reference.toUserId !== req.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const updatedReference = await prisma.reference.update({
        where: { id },
        data: { status: 'rejected' },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              title: true,
              avatar: true,
              linkedin: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.json(updatedReference);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
};