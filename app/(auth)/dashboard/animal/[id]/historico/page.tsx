import { WeightsChart } from './chart';

export default function WeightHistory() {
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-3">
				<WeightsChart />
			</div>
		</div>
	);
}
