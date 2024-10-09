import React from "react";

interface TableRowProps {
  row: any;
  columns: string[];
}

const TableRow = ({ row, columns }: TableRowProps) => {
  return (
    <tr>
      {columns.map((column, index) => (
        <td key={index}>{row[index]}</td>
      ))}
    </tr>
  );
};

export default TableRow;