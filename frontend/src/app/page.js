import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/clientes');
  return null;
}
