import { NextResponse } from "next/server";

const lotes = [
  { id: 1, name: "Lote 1" },
  { id: 2, name: "Lote 2" },
  { id: 3, name: "Lote 3" },
];

export async function GET(req: Request, res: Response) {
  return NextResponse.json(lotes);
}