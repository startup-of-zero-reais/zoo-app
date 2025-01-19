import { redirect } from 'next/navigation';

export default function UnknownPage() {
	return redirect('/dashboard');
}
