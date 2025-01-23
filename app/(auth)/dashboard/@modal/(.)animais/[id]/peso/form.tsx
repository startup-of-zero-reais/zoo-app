'use client';

import { useCallback, useState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useOpenChange } from '@/hooks/use-open-change';

export default function WeightForm() {
	const [open, onOpenChange, onClose] = useOpenChange();

	const [scale, setScale] = useState('k');

	const isLoading = false;

	const onSubmit = useCallback(() => {
		onClose();
	}, [onClose]);

	return (
		<Dialog defaultOpen={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Novo peso</DialogTitle>
					<DialogDescription>
						Adicione um novo peso aqui. Clique para salvar quando estiver pronto
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-4">
						<div className="grid grid-cols-[1fr,auto] gap-4">
							<div>
								<Label htmlFor="name">Peso</Label>
								<Input id="name" name="name" type="number" placeholder="300" />
							</div>

							<div>
								<Label htmlFor="obs">Escala</Label>
								<ToggleGroup
									type="single"
									variant="outline"
									value={scale}
									onValueChange={setScale}
								>
									<ToggleGroupItem value="k">Kilos</ToggleGroupItem>
									<ToggleGroupItem value="g">Gramas</ToggleGroupItem>
								</ToggleGroup>
							</div>
						</div>
					</div>
				</form>

				<DialogFooter>
					<Button disabled={isLoading} type="submit">
						{isLoading ? <LoaderCircle className="animate-spin" /> : <Save />}
						Salvar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
