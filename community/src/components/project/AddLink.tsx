import { LinkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { validateURL } from "../../lib/url";

function AddLink({
	handleClose,
	addLinks,
}: {
	handleClose: () => void;
	addLinks: (links: string[]) => void;
}) {
	const [links, setLinks] = useState<string[]>([]);
	const [link, setLink] = useState("");
	const [error, setError] = useState("");

	function handleNext() {
		if (links) {
			addLinks(links);
		}
		handleClose();
	}

	function handleLink() {
		if (link) {
			if (!validateURL(link)) {
				setError(
					"Invalid URL (make sure to include http:// or https://)"
				);
			} else if (links.includes(link)) {
				setError("Link already added");
			} else {
				setLinks([...links, link]);
				setLink("");
				setError("");
			}
		}
	}

	return (
		<div className="min-h-1/2 w-1/2 bg-slate-200 rounded-xl flex flex-col space-y-2 p-4 text-slate-400">
			<div className="flex-grow flex flex-col space-y-2 justify-center items-center border-dashed border-2 p-4 border-black/25">
				<LinkIcon className="h-24 w-24" />
				<p className="text-2xl">Add Link</p>
				<div className="flex flex-row space-x-2 w-2/3">
					<label className="flex flex-col justify-center items-center w-full">
						<input
							title="Input link"
							type="text"
							name="link"
							className="focus:outline-none p-2 w-full"
							value={link}
							onChange={(e) => setLink(e.target.value)}
						/>
					</label>
					<button
						type="button"
						title="Add link"
						className="bg-sky-700 text-white p-2 rounded-xl"
						onClick={handleLink}
					>
						<PlusIcon className="h-6 w-6" />
					</button>
				</div>
				{error && <p className="text-red-500">{error}</p>}
			</div>
			<aside>
				<ul className="flex flex-col space-y-2 max-h-40 overflow-y-scroll">
					{links.map((link) => (
						<li
							key={link}
							className="flex items-center justify-between bg-white p-1"
						>
							<a
								href={link}
								className="text-sky-700"
								target="_blank"
								rel="noreferrer"
							>
								{link}
							</a>
							<XMarkIcon
								className="h-6 w-6 cursor-pointer"
								onClick={() =>
									setLinks(links.filter((l) => l !== link))
								}
							/>
						</li>
					))}
				</ul>
			</aside>
			<button
				type="button"
				className="bg-sky-700 rounded-lg py-2 text-white"
				onClick={handleNext}
			>
				Next
			</button>
		</div>
	);
}

export default AddLink;
