import React from 'react'

interface TableHeaderProps {
  columns: string[]
}
const TableHeader = ({ columns }: TableHeaderProps) => {
  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th key={index}>{column}</th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader