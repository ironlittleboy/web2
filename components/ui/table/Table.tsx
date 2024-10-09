import React from 'react'
import TableHeader from './TableHeader'
import TableBody from './TableBody'

interface TableProps {
  data: any[]
  columns: string[]

}
const Table = ({ data, columns }: TableProps) => {
  return (
    <table>
      <TableHeader columns={columns} />
      <TableBody columns={columns} data={data}/>
    </table>

  )
}

export default Table