'use client';

import 'flag-icons/css/flag-icons.min.css';

type Props = {
	countryCode: 'FR' | 'GB' | 'EN';
	className?: string;
};

const countryClassMap: Record<'FR' | 'GB' | 'EN', string> = {
	FR: 'fi fi-fr',
	GB: 'fi fi-gb',
	EN: 'fi fi-gb', // English uses GB flag
};

export default function CountryFlag({
	countryCode,
	className = '',
}: Props) {
	return (
		<span
			className={`fi ${countryClassMap[countryCode]} ${className}`}
		/>
	);
}
