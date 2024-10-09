import React from 'react'
import TableRow from './TableRow'

interface TableBodyProps {
  data: any[]
  columns: string[]
}
const TableBody = ({ data, columns }: TableBodyProps) => {
  return (
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          {columns.map((column, index) => (
            <TableRow key={index} row={row} columns={columns} />
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody