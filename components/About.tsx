import Image from "next/image";
import type { Dictionary } from "@/locales/dictionaries";

type Props = {
	dict: Dictionary;
};

const About = ({ dict }: Props) => {
	return (
		<section className="pt-24">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row items-center">
					<div className="md:w-1/3 mb-8 md:mb-0">
						<Image
							src="/geek.svg"
							alt={dict.about.imageAlt}
							width={300}
							height={300}
							className="rounded-full"
						/>
					</div>
					<div className="md:w-2/3 md:pl-8">
						<p className="mb-4 text-lg font-semibold">{dict.about.intro}</p>
						<p className="mb-4">
							{dict.about.location}{" "}
							<strong className="font-bold">{dict.about.chartres}</strong>,{" "}
							{dict.about.services}{" "}
							<strong className="font-bold">{dict.about.creation}</strong>, l'
							<strong className="font-bold">{dict.about.optimization}</strong>{" "}
							{dict.about.to} la{" "}
							<strong className="font-bold">{dict.about.maintenance}</strong>{" "}
							{dict.about.description}
						</p>
						<p className="mb-4">
							{dict.about.goal}{" "}
							<strong className="font-bold">
								{dict.about.uniqueSolutions}
							</strong>
							{dict.about.adapted}
						</p>
						<p>
							{dict.about.expertise}{" "}
							<strong className="font-bold">{dict.about.innovative}</strong>{" "}
							{dict.about.to}{" "}
							<strong className="font-bold">{dict.about.fluidUX}</strong>
							{dict.about.commitment}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
