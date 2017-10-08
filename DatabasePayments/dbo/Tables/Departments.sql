CREATE TABLE [dbo].[Departments] (
    [DepartmentID] INT            IDENTITY (1, 1) NOT NULL,
    [Name]         NVARCHAR (255) NOT NULL,
    PRIMARY KEY CLUSTERED ([DepartmentID] ASC)
);

