import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ServiceItem = {
	id: string;
	label: string;
	group: string;
};

type Props = {
	className?: string;
	onSelect?: (service: ServiceItem) => void;
};

/**
 * Floating bar + translucent blurred popover for selecting design categories.
 * Exports default to preserve the existing import in `src/pages/Index.tsx`.
 */
export default function DesignSelector({ className, onSelect }: Props) {
	const [open, setOpen] = useState(false);
	const [activeGroup, setActiveGroup] = useState<string>("All");

	// Curated groups and items
	const groups = useMemo(
		() => [
			"All",
			"Brand & Identity",
			"Digital & Experience",
			"Products & Objects",
			"Publications & Media",
			"Marketing & Campaigns",
			"Special Creative",
		],
		[]
	);

	const items: ServiceItem[] = useMemo(
		() => [
			// Brand & Identity
			{ id: "logo", label: "Logo Design", group: "Brand & Identity" },
			{ id: "brand-identity", label: "Brand Identity Systems", group: "Brand & Identity" },
			{ id: "packaging", label: "Packaging Design", group: "Brand & Identity" },
			{ id: "type-color", label: "Typography & Color Systems", group: "Brand & Identity" },
			{ id: "guidelines", label: "Brand Guidelines", group: "Brand & Identity" },

			// Digital & Experience
			{ id: "ui-ux", label: "UI/UX Design", group: "Digital & Experience" },
			{ id: "website", label: "Website / Landing Page Design", group: "Digital & Experience" },
			{ id: "mobile-app", label: "Mobile App Design", group: "Digital & Experience" },
			{ id: "interactive", label: "Interactive Prototypes", group: "Digital & Experience" },
			{ id: "dashboards", label: "Dashboards & Platforms", group: "Digital & Experience" },

			// Products & Objects
			{ id: "product-design", label: "Product Design (physical)", group: "Products & Objects" },
			{ id: "3d", label: "3D Visualization & Renders", group: "Products & Objects" },
			{ id: "mockups", label: "Mockups & Prototypes", group: "Products & Objects" },

			// Publications & Media
			{ id: "books", label: "Book Design (covers + layouts)", group: "Publications & Media" },
			{ id: "magazine", label: "Magazine / Editorial Design", group: "Publications & Media" },
			{ id: "annual-report", label: "Annual Reports", group: "Publications & Media" },
			{ id: "whitepaper", label: "Whitepapers / eBooks", group: "Publications & Media" },

			// Marketing & Campaigns
			{ id: "campaigns", label: "Advertising Campaigns", group: "Marketing & Campaigns" },
			{ id: "social", label: "Social Media Post Design", group: "Marketing & Campaigns" },
			{ id: "motion", label: "Motion Graphics / Video Ads", group: "Marketing & Campaigns" },
			{ id: "ooh", label: "Out-of-Home (billboards, posters)", group: "Marketing & Campaigns" },

			// Special Creative
			{ id: "concepts", label: "Creative Concepts", group: "Special Creative" },
			{ id: "collaterals", label: "Brand Collaterals (cards, stationery, merch)", group: "Special Creative" },
			{ id: "event-identity", label: "Event / Campaign Visual Identity", group: "Special Creative" },
			{ id: "decks", label: "Presentations & Pitch Decks", group: "Special Creative" },
		],
		[]
	);

	const grouped = useMemo(() => {
		if (activeGroup === "All") return { All: items };
		return { [activeGroup]: items.filter((i) => i.group === activeGroup) };
	}, [activeGroup, items]);

	const handleSelect = (item: ServiceItem) => {
		onSelect?.(item);
		// Default behavior: navigate to contact with prefilled message
		if (!onSelect) {
			const url = `/contact?service=${encodeURIComponent(item.label)}&message=${encodeURIComponent(
				`Hi King, I want design for: ${item.label}`
			)}`;
			window.location.href = url;
		}
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="hero"
					size="lg"
					className={cn(
						"px-5 h-12 rounded-xl border border-black/10 bg-white/40 shadow-sm backdrop-blur-md text-sm text-neutral-900 hover:bg-white/60 hover:shadow-md",
						"flex items-center gap-2",
						className
					)}
					aria-label="Open design category selector"
				>
					<span className="opacity-90">I want design for</span>
					{open ? <ChevronUp className="h-4 w-4 opacity-80" /> : <ChevronDown className="h-4 w-4 opacity-80" />}
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align="center"
				sideOffset={10}
				className={cn(
					"w-[min(92vw,680px)] p-0 rounded-xl overflow-hidden border border-black/10 bg-white/35 backdrop-blur-2xl shadow-2xl",
					"data-[state=open]:animate-in data-[side=bottom]:slide-in-from-top-2"
				)}
			>
				{/* Group filter pills */}
				<div className="flex flex-wrap gap-2 p-3 border-b border-black/10 bg-white/25 backdrop-blur-sm rounded-t-xl">
					{groups.map((g) => (
						<button
							key={g}
							type="button"
							onClick={() => setActiveGroup(g)}
							className={cn(
								"px-3 py-1 text-xs rounded-full transition",
								activeGroup === g
									? "bg-black text-white"
									: "bg-white/60 text-neutral-900 hover:bg-white"
							)}
							aria-pressed={activeGroup === g}
						>
							{g}
						</button>
					))}
				</div>

				{/* Searchable, grouped list */}
				<Command className="bg-transparent">
					<CommandInput placeholder="Search design needs…" />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>

						{Object.entries(grouped).map(([groupName, groupItems], gi) => (
							<div key={groupName}>
								<CommandGroup heading={groupName}>
									<ScrollArea className="max-h-[320px]">
										<div className="py-1">
											{groupItems.map((item) => (
												<CommandItem
													key={item.id}
													onSelect={() => handleSelect(item)}
													className="cursor-pointer"
												>
													<span className="text-sm">{item.label}</span>
													<span className="ml-auto text-xs text-muted-foreground">{item.group}</span>
												</CommandItem>
											))}
										</div>
									</ScrollArea>
								</CommandGroup>
								{gi < Object.keys(grouped).length - 1 && <CommandSeparator />}
							</div>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
