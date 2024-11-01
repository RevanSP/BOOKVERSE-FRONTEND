/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Chapter, Manhwa } from "../types";
import AlertManhwa from "../components/AlertManhwa";
import { Fancybox } from "@fancyapps/ui";
import Layout from "../layout/Layout";

const ManhwaSection: React.FC = () => {
    const [manhwaData, setManhwaData] = useState<Manhwa[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedGenre, setSelectedGenre] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [itemsPerPage, setItemsPerPage] = useState<number>(16);
    const genres = Array.from(new Set(manhwaData.flatMap(manhwa => manhwa.info.genres)));
    const [isSearchInputClicked, setIsSearchInputClicked] = useState<boolean>(false);
    const [selectedManhwa, setSelectedManhwa] = useState<Manhwa | null>(null);
    const [readingHistory, setReadingHistory] = useState<Record<string, number | null>>({});
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const manhwaTotal = manhwaData.length;

    useEffect(() => {
        const storedHistory = localStorage.getItem('manhwaReadingHistory');
        if (storedHistory) {
            setReadingHistory(JSON.parse(storedHistory));
        }
    }, []);

    const handleChapterClick = (chapter: Chapter) => {
        const galleryImages = chapter.images.map((imageUrl) => ({
            src: imageUrl,
            type: 'image' as const,
            options: {
                referrerpolicy: "no-referrer",
                loading: 'lazy',
                onError: () => {
                    console.error(`Error loading image: ${imageUrl}`);
                },
            },
        }));

        Fancybox.show(galleryImages);
        if (modalRef.current) {
            modalRef.current.close();
        }

        const preloadImage = (url: string): Promise<HTMLImageElement> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = url;
                img.referrerPolicy = "no-referrer";
                img.loading = "lazy";

                const tryLoadImage = () => {
                    img.onload = () => {
                        resolve(img);
                    };

                    img.onerror = () => {
                        console.error(`Failed to load image: ${url}. Retrying...`);
                        setTimeout(tryLoadImage, 1000);
                    };
                };

                tryLoadImage();
            });
        };

        Promise.all(chapter.images.map(preloadImage))
            .then(() => {
                console.log("All images preloaded successfully");
            })
            .catch((error) => {
                console.error("Unexpected error:", error);
            });

        setReadingHistory((prevHistory) => {
            const newHistory = {
                ...prevHistory,
                [selectedManhwa?.title || ""]: chapter.number as unknown as number,
            };
            localStorage.setItem('manhwaReadingHistory', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const handleCardClick = (manhwa: Manhwa) => {
        setSelectedManhwa(manhwa);
        const modal = document.getElementById('manhwaModal') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    };

    const handleSearchInputClick = () => {
        setCurrentPage(1);
        setIsSearchInputClicked(true);
        setSelectedGenre("");
    };

    useEffect(() => {
        if (isSearchInputClicked) {
            setIsSearchInputClicked(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(9);
            } else {
                setItemsPerPage(16);
            }
        };
        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => {
            window.removeEventListener('resize', updateItemsPerPage);
        };
    }, []);

    useEffect(() => {
        fetch(`https://booksverse-api.vercel.app/manhwa?apikey=${import.meta.env.VITE_API_KEY}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0",
                "Referer": "https://komikindo.my/",
                "Accept": "application/json",
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const uniqueManhwa: Record<string, Manhwa> = {};

                data.forEach((manhwa: Manhwa) => {
                    if (manhwa.imageUrl && manhwa.imageUrl.startsWith("https://") && manhwa.title) {
                        if (!uniqueManhwa[manhwa.title]) {
                            uniqueManhwa[manhwa.title] = manhwa;
                        }
                    }
                });
                setManhwaData(Object.values(uniqueManhwa));
            })
            .catch((error) => console.error("Error fetching manhwa data:", error));
    }, []);

    const filteredManhwaData = manhwaData.filter(manhwa => {
        const matchesGenre = selectedGenre ? manhwa.info.genres.includes(selectedGenre) : true;
        const matchesSearch = manhwa.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    const totalPages = Math.ceil(filteredManhwaData.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const currentManhwaData = filteredManhwaData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const hasResults = currentManhwaData.length > 0;

    const handleGenreClick = (genre: string) => {
        setSelectedGenre(genre);
        setSearchQuery("");
        setCurrentPage(1);
    };

    const handleReset = () => {
        setSelectedGenre("");
        setSearchQuery("");
        setCurrentPage(1);
    };

    const genreCounts = genres.map((genre) => ({
        name: genre,
        count: manhwaData.filter(manhwa => manhwa.info.genres.includes(genre)).length,
    }));

    return (
        <>
            <Layout>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 mt-2">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-4xl sm:text-5xl font-bold" id="MANHWA">MANHWA</h1>
                        <div className="dropdown dropdown-bottom dropdown-end sm:hidden">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-base-300 border-2 border-neutral-content rounded"
                            >
                                <i className="fa-solid fa-caret-down"></i>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu menu-xs bg-base-100 rounded-box z-[1] w-36 p-2 shadow border-2 border-neutral-content mt-1 overflow-y-auto max-h-96"
                            >
                                {genreCounts.map(({ name, count }) => (
                                    <li key={name} onClick={() => handleGenreClick(name)}>
                                        <a className="text-xs">{name} ({count})</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-center w-full gap-2">
                        <label className="input input-bordered flex items-center mt-3 sm:mt-0 gap-2 w-full border-neutral-content border-2 rounded bg-base-200">
                            <input
                                type="text"
                                className="grow"
                                placeholder={`Search Manhwa (${manhwaTotal})`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={handleSearchInputClick}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </label>
                    </div>
                    <div className="hidden sm:flex items-center ml-2">
                        <div className="dropdown dropdown-bottom dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-base-300 border-2 border-neutral-content rounded"
                            >
                                <i className="fa-solid fa-caret-down"></i>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu menu-xs bg-base-100 rounded-box z-[1] w-36 p-2 shadow border-2 border-neutral-content mt-1 overflow-y-auto max-h-96"
                            >
                                {genreCounts.map(({ name, count }) => (
                                    <li key={name} onClick={() => handleGenreClick(name)}>
                                        <a className="text-xs">{name} ({count})</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" data-aos="fade-up">
                    {hasResults ? (
                        currentManhwaData.map((manhwa, index) => {
                            return (
                                <div
                                    key={index}
                                    className="card bg-base-200 shadow-xl border-2 border-neutral-content rounded p-0 relative transition-transform duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => handleCardClick(manhwa)}
                                >
                                    <img loading="lazy"
                                        src={manhwa.imageUrl}
                                        alt={manhwa.title}
                                        className="w-full h-48 object-cover border-b-2 rounded-t border-neutral-content transition duration-300 ease-in-out hover:filter hover:grayscale"
                                        referrerPolicy="no-referrer"
                                    />
                                    <p className="text-md text-center truncate font-bold mt-2 px-3">{manhwa.title}</p>
                                    <div className="rating rating-xs flex justify-center mt-1 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <input
                                                key={star}
                                                type="radio"
                                                name={`rating-${manhwa.title}`}
                                                className="mask mask-star-2 bg-orange-400"
                                                checked={Math.round(parseFloat(manhwa.rating) / 2) === star}
                                                readOnly
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <AlertManhwa />
                    )}
                </div>
                {hasResults && (
                    <div className="overflow-x-auto mt-4">
                        <div className="join flex justify-start gap-2 w-full max-w-full whitespace-nowrap">
                            <button
                                className="join-item btn btn-xs btn-base-300 border-2 rounded border-neutral-content"
                                onClick={handleReset}
                            ><i className="fa-solid fa-rotate"></i>
                            </button>
                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`join-item btn btn-xs btn-base-300 border-2 rounded border-neutral-content ${currentPage === page ? "btn-active" : ""}`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </Layout>
            <dialog ref={modalRef} id="manhwaModal" className="modal">
                <div className="modal-box w-11/12 max-w-6xl border-2 border-neutral-content rounded">
                    <form method="dialog">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            type="button"
                            onClick={() => {
                                if (modalRef.current) {
                                    modalRef.current.close();
                                }
                            }}
                        >
                            ✕
                        </button>
                    </form>
                    {selectedManhwa && (
                        <>
                            <h3 className="font-bold text-lg mb-4">MANHWA</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-base-200 rounded flex border-2 border-neutral-content relative">
                                    <img loading="lazy"
                                        referrerPolicy="no-referrer"
                                        src={selectedManhwa.imageUrl}
                                        className="mb-2 rounded border-2 border-neutral-content w-32"
                                        alt={selectedManhwa.title}
                                    />
                                    <ul className="ml-4 list-disc list-inside space-y-1">
                                        <li className="text-sm"><strong>Title :</strong> {selectedManhwa.title}</li>
                                        <li className="text-sm"><strong>Author :</strong> {selectedManhwa.info.author}</li>
                                        <li className="text-sm"><strong>Genres :</strong> {selectedManhwa.info.genres.join(", ")}</li>
                                        <li className="text-sm"><strong>Recent Read :</strong> {readingHistory[selectedManhwa?.title] !== undefined ? `Chapter ${readingHistory[selectedManhwa.title]}` : "NONE"}</li>
                                    </ul>
                                    <div className="absolute bottom-4 right-4">
                                        <div className="tooltip tooltip-top tooltip-primary" data-tip="If images are blank, try reopening the chapter or refreshing the page. It is recommended to use Google Public DNS for better performance, as some internet service providers may restrict direct access to certain content.">
                                            <button className="btn btn-sm btn-base-200 border-2 border-neutral-content rounded">
                                                <i className="fa-solid fa-circle-info"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-base-200 rounded h-60 overflow-y-auto border-neutral-content border-2">
                                    <h4 className="font-bold mb-4 text-center">CHAPTERS</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {selectedManhwa.chapters.map((chapter) => (
                                            <button
                                                key={chapter.number}
                                                className="btn btn-sm btn-base-300 border-2 rounded border-neutral-content w-full mb-1"
                                                onClick={() => handleChapterClick(chapter)}
                                            >
                                                Chapter {chapter.number}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </dialog>
        </>
    );
};

export default ManhwaSection;
