CREATE TABLE [dbo].[Employees] (
    [EmployeeID]   INT            IDENTITY (1, 1) NOT NULL,
    [Name]         NVARCHAR (255) NOT NULL,
    [DepartmentID] INT            NULL,
    PRIMARY KEY CLUSTERED ([EmployeeID] ASC),
    CONSTRAINT [FKEY_DepartmentID] FOREIGN KEY ([DepartmentID]) REFERENCES [dbo].[Departments] ([DepartmentID])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Отдел в котором работает сотрудник. Могут быть сотрудники, у которых временно нет привязанного отдела, поэтому поле может быть нулевым.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Employees', @level2type = N'COLUMN', @level2name = N'DepartmentID';

