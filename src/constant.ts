export const TransactionStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export const TransactionType = {
    INCOMING: 'INCOMING',
    OUTGOING: 'OUTGOING',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];