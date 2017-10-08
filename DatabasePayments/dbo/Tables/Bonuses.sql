CREATE TABLE [dbo].[Bonuses] (
    [BonusID]    INT             IDENTITY (1, 1) NOT NULL,
    [EmployeeID] INT             NOT NULL,
    [Value]      DECIMAL (18, 4) NOT NULL,
    PRIMARY KEY CLUSTERED ([BonusID] ASC),
    CONSTRAINT [FKEY_EmployeeID] FOREIGN KEY ([EmployeeID]) REFERENCES [dbo].[Employees] ([EmployeeID])
);

