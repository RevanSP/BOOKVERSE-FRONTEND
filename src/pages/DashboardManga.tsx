import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import SidebarDashboard from '../components/SidebarDashboard';
import NavbarDashboard from '../components/NavbarDashboard';
import { Link } from 'react-router-dom';
import { Chapter, Manga } from '../types';

const DashboardManga: React.FC = () => {
    const [mangaData, setMangaData] = useState<Manga[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedManga, setSelectedManga] = useState<Set<string>>(new Set());
    const [editManga, setEditManga] = useState<Manga | null>(null);
    const userEmail = localStorage.getItem('userEmail');
    const itemsPerPage = 40;
    const indexOfLastManga = currentPage * itemsPerPage;
    const indexOfFirstManga = indexOfLastManga - itemsPerPage;

    const [newManga, setNewManga] = useState<Manga>({
        title: '',
        imageUrl: '',
        rating: '',
        info: {
            author: '',
            genres: [],
            alternativeTitles: [],
            status: '',
            illustrator: ''
        },
        chapters: []
    });

    useEffect(() => {
        fetch("/manga-komikindo.json", {
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
                const uniqueManga: Record<string, Manga> = {};
                data.forEach((manga: Manga) => {
                    if (
                        manga.error !== "Failed to scrape details" &&
                        manga.imageUrl &&
                        manga.imageUrl.startsWith("https://") &&
                        manga.title &&
                        manga.chapters.length > 0
                    ) {
                        if (!uniqueManga[manga.title]) {
                            uniqueManga[manga.title] = manga;
                        }
                    }
                });
                const sortedManga = Object.values(uniqueManga).sort((a, b) => {
                    return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
                });
                setMangaData(sortedManga);
            })
            .catch((error) => console.error("Error fetching manga data:", error));
    }, []);

    const filteredManga = mangaData.filter(manga =>
        manga.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const currentManga = filteredManga.slice(indexOfFirstManga, indexOfLastManga);
    const totalPages = Math.ceil(filteredManga.length / itemsPerPage);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allTitles = new Set(currentManga.map(manga => manga.title));
            setSelectedManga(allTitles);
        } else {
            setSelectedManga(new Set());
        }
    };

    const handleSelectManga = (mangaTitle: string) => {
        const updatedSelection = new Set(selectedManga);
        if (updatedSelection.has(mangaTitle)) {
            updatedSelection.delete(mangaTitle);
        } else {
            updatedSelection.add(mangaTitle);
        }
        setSelectedManga(updatedSelection);
    };

    const openEditModal = (manga: Manga) => {
        setEditManga(manga);
        const dialog = document.getElementById('MangaEDIT') as HTMLDialogElement;
        dialog?.showModal();
    };

    const [isEdited, setIsEdited] = useState(false);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (editManga) {
            setIsEdited(true); 
            if (field === 'genres') {
                const genresArray = e.target.value.split(',').map(g => g.trim());
                setEditManga({
                    ...editManga,
                    info: {
                        ...editManga.info,
                        genres: genresArray,
                    },
                });
            } else if (field === 'author') {
                setEditManga({
                    ...editManga,
                    info: {
                        ...editManga.info,
                        author: e.target.value,
                    },
                });
            } else {
                setEditManga({
                    ...editManga,
                    [field]: e.target.value,
                });
            }
        }
    };

    const handleNewMangaChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (field === 'genres') {
            const genresArray = e.target.value.split(',').map(g => g.trim());
            setNewManga({
                ...newManga,
                info: {
                    ...newManga.info,
                    genres: genresArray,
                },
            });
        } else if (field === 'author' || field === 'illustrator' || field === 'status') {
            setNewManga({
                ...newManga,
                info: {
                    ...newManga.info,
                    [field]: e.target.value,
                },
            });
        } else {
            setNewManga({
                ...newManga,
                [field]: e.target.value,
            });
        }
    };

    const handleAddManga = () => {
        setMangaData([...mangaData, newManga]);
        setNewManga({
            title: '',
            imageUrl: '',
            rating: '',
            info: { author: '', genres: [] },
            chapters: []
        });
        const dialog = document.getElementById('MangaADD') as HTMLDialogElement;
        dialog?.close();
    };

    const addChapterAtTop = () => {
        const newChapter: Chapter = { number: '', url: '', datePosted: '', images: [''] };
        if (editManga) {
            const updatedChapters = [newChapter, ...editManga.chapters];
            setEditManga({ ...editManga, chapters: updatedChapters });
        }
    };

    return (
        <>
            <SidebarDashboard>
                <NavbarDashboard />
                <div className="flex-grow flex flex-col p-4">
                    <div className="breadcrumbs text-xs">
                        <ul>
                            <li><Link to='/dashboard'>Dashboard</Link></li>
                            <li><Link to="/manga-tab">Manga Tab</Link></li>
                        </ul>
                    </div>
                    <div className="bg-base-300 rounded border-2 border-neutral-content shadow-xl p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <label className="input input-bordered flex border-2 bg-base-200 border-neutral-content input-sm items-center grow">
                                <input
                                    type="text"
                                    className="flex-grow"
                                    placeholder={`Search Manga (${filteredManga.length})`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                            <button
                                className="btn btn-sm border-2 border-neutral-content rounded btn-base-200"
                                onClick={() => {
                                    const dialog = document.getElementById('MangaADD') as HTMLDialogElement;
                                    dialog?.showModal();
                                }}
                            ><i className="fa-solid fa-plus"></i>
                            </button>
                            <button
                                className={`btn btn-sm border-2 border-neutral-content rounded btn-base-200 ${userEmail !== 'revanspstudy28@gmail.com' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={userEmail !== 'revanspstudy28@gmail.com' || selectedManga.size === 0}
                            >
                                <i className="fa-solid fa-delete-left"></i>
                            </button>
                        </div>
                        <div className="overflow-x-auto pb-2">
                            <table className="table table-xs table-zebra">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox" className="checkbox checkbox-sm"
                                                onChange={handleSelectAll}
                                                checked={currentManga.length > 0 && currentManga.every(manga => selectedManga.has(manga.title))}
                                            />
                                        </th>
                                        <th>NO</th>
                                        <th>TITLE</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentManga.length > 0 ? (
                                        currentManga.map((manga, index) => (
                                            <tr key={manga.title}>
                                                <td>
                                                    <input
                                                        type="checkbox" className="checkbox checkbox-sm"
                                                        checked={selectedManga.has(manga.title)}
                                                        onChange={() => handleSelectManga(manga.title)}
                                                    />
                                                </td>
                                                <td className="text-xs font-bold">{index + 1 + indexOfFirstManga}</td>
                                                <td className="text-xs font-bold truncate">{manga.title}</td>
                                                <td>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="btn btn-xs border-2 border-neutral-content rounded btn-base-200"
                                                            onClick={() => openEditModal(manga)}
                                                        ><i className="fa-solid fa-pen"></i>
                                                        </button>

                                                        <button disabled={userEmail !== 'revanspstudy28@gmail.com'} className="btn btn-xs border-2 border-neutral-content rounded btn-base-200">
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center">
                                                <div role="alert" className="alert border-2 border-neutral-content alert-primary rounded">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 shrink-0 stroke-current"
                                                        fill="none"
                                                        viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>No manga found</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>NO</th>
                                        <th>TITLE</th>
                                        <th>ACTION</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="mt-4">
                            <div className="overflow-x-auto pb-3">
                                <div className="flex space-x-2">
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index + 1}
                                            className={`join-item btn btn-xs ${currentPage === index + 1 ? 'btn-active' : ''}`}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <dialog id="MangaADD" className="modal">
                    <div className="modal-box w-11/12 max-w-7xl border-2 border-neutral-content rounded">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <form method="dialog" onSubmit={(e) => { e.preventDefault(); handleAddManga(); }}>
                            <h3 className="font-bold text-lg">ADD</h3>
                            <div className="py-4">
                                <div>
                                    <label className="label">Title :</label>
                                    <input
                                        type="text"
                                        className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                        value={newManga.title}
                                        onChange={(e) => handleNewMangaChange(e, 'title')}
                                        placeholder="Enter manga title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Image URL :</label>
                                    <input
                                        type="url"
                                        className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                        value={newManga.imageUrl}
                                        onChange={(e) => handleNewMangaChange(e, 'imageUrl')}
                                        placeholder="Enter image URL"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Rating :</label>
                                    <input
                                        type="number"
                                        className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                        value={newManga.rating}
                                        onChange={(e) => handleNewMangaChange(e, 'rating')}
                                        placeholder="Enter rating"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="label">Author :</label>
                                    <input
                                        type="text"
                                        className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                        value={newManga?.info.author || ''}
                                        onChange={(e) => handleNewMangaChange(e, 'author')}
                                        placeholder="Enter author name"
                                    />
                                </div>
                                <div>
                                    <label className="label">Genres :</label>
                                    <input
                                        type="text"
                                        className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                        value={(newManga?.info.genres || []).join(', ')}
                                        onChange={(e) => handleNewMangaChange(e, 'genres')}
                                        placeholder="Enter genres (comma separated)"
                                    />
                                </div>
                                <div>
                                    <label className="label mt-2">Chapters :</label>
                                    {newManga.chapters.map((chapter, index) => (
                                        <div key={index} className="mb-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                    placeholder={`Chapter ${newManga.chapters.length - index} Number`}
                                                    value={chapter.number}
                                                    onChange={(e) => {
                                                        const updatedChapters = [...newManga.chapters];
                                                        updatedChapters[index].number = e.target.value;
                                                        setNewManga({ ...newManga, chapters: updatedChapters });
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-base-200 border-2 border-neutral-content rounded ml-2"
                                                    onClick={() => {
                                                        const updatedChapters = [...newManga.chapters];
                                                        updatedChapters.splice(index, 1);
                                                        setNewManga({ ...newManga, chapters: updatedChapters });
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                            {chapter.images.map((image, imgIndex) => (
                                                <div key={imgIndex} className="flex items-center py-1">
                                                    <input
                                                        type="url"
                                                        className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                        placeholder={`Chapter ${newManga.chapters.length - index} Image ${imgIndex + 1}`}
                                                        value={image}
                                                        onChange={(e) => {
                                                            const updatedChapters = [...newManga.chapters];
                                                            updatedChapters[index].images[imgIndex] = e.target.value;
                                                            setNewManga({ ...newManga, chapters: updatedChapters });
                                                        }}
                                                    />
                                                    <button type="button"
                                                        className="btn btn-sm btn-base-300 border-2 border-neutral-content rounded ml-2"
                                                        onClick={() => {
                                                            const updatedChapters = [...newManga.chapters];
                                                            updatedChapters[index].images.splice(imgIndex, 1);
                                                            setNewManga({ ...newManga, chapters: updatedChapters });
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-x"></i>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="btn btn-sm border-2 border-neutral-content btn-wide w-full mt-2 btn-base-300"
                                                type="button"
                                                onClick={() => {
                                                    const updatedChapters = [...newManga.chapters];
                                                    updatedChapters[index].images.unshift('');
                                                    setNewManga({ ...newManga, chapters: updatedChapters });
                                                }}
                                            >
                                                Add Image
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm border-2 border-neutral-content btn-wide w-full mt-2 btn-neutral"
                                        onClick={() => {
                                            const newChapter: Chapter = {
                                                number: '',
                                                images: [''],
                                                url: '',
                                                datePosted: ''
                                            };
                                            const updatedChapters = [...newManga.chapters];
                                            updatedChapters.unshift(newChapter);
                                            setNewManga({ ...newManga, chapters: updatedChapters });
                                        }}
                                    >
                                        Add Chapter
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-sm btn-base-300 mt-4 btn-wide w-full border-2 border-neutral-content rounded"
                                disabled={userEmail !== 'revanspstudy28@gmail.com'}
                            >
                                SUBMIT
                            </button>
                        </form>
                    </div>
                </dialog>
                <dialog id="MangaEDIT" className="modal">
                    <div className="modal-box w-11/12 max-w-7xl border-2 border-neutral-content rounded">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        {editManga && (
                            <>
                                <h3 className="font-bold text-lg">EDIT</h3>
                                <div className="py-4">
                                    <div>
                                        <label className="label">Title :</label>
                                        <input
                                            type="text"
                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                            value={editManga.title}
                                            onChange={(e) => handleEditChange(e, 'title')}
                                            placeholder="Enter manga title"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Image URL :</label>
                                        <input
                                            type="url"
                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                            value={editManga.imageUrl}
                                            onChange={(e) => handleEditChange(e, 'imageUrl')}
                                            placeholder="Enter image URL"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Rating :</label>
                                        <input
                                            type="number"
                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                            value={editManga.rating}
                                            onChange={(e) => handleEditChange(e, 'rating')}
                                            placeholder="Enter rating"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Author :</label>
                                        <input
                                            type="text"
                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                            value={editManga?.info.author || ''}
                                            onChange={(e) => handleEditChange(e, 'author')}
                                            placeholder="Enter author name"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Genres :</label>
                                        <input
                                            type="text"
                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                            value={(editManga?.info.genres || []).join(', ')}
                                            onChange={(e) => handleEditChange(e, 'genres')}
                                            placeholder="Enter genres (comma separated)"
                                        />
                                    </div>
                                    <div>
                                        <label className="label mt-2">Chapters :</label>
                                        {editManga.chapters.map((chapter, index) => (
                                            <div key={index} className="mb-4">
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                        placeholder={`Chapter ${index + 1} Number`}
                                                        value={chapter.number}
                                                        onChange={(e) => {
                                                            const updatedChapters = [...editManga.chapters];
                                                            updatedChapters[index].number = e.target.value;
                                                            setEditManga({ ...editManga, chapters: updatedChapters });
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm rounded btn-base-200 border-2 border-neutral-content ml-2"
                                                        onClick={() => {
                                                            const updatedChapters = [...editManga.chapters];
                                                            updatedChapters.splice(index, 1);
                                                            setEditManga({ ...editManga, chapters: updatedChapters });
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                                {chapter.images.map((image, imgIndex) => (
                                                    <div key={imgIndex} className="flex items-center py-1">
                                                        <input
                                                            type="url"
                                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                            placeholder={`Chapter ${index + 1} Image ${imgIndex + 1}`}
                                                            value={image}
                                                            onChange={(e) => {
                                                                const updatedChapters = [...editManga.chapters];
                                                                updatedChapters[index].images[imgIndex] = e.target.value;
                                                                setEditManga({ ...editManga, chapters: updatedChapters });
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-base-300 border-2 border-neutral-content rounded ml-2"
                                                            onClick={() => {
                                                                const updatedChapters = [...editManga.chapters];
                                                                updatedChapters[index].images.splice(imgIndex, 1);
                                                                setEditManga({ ...editManga, chapters: updatedChapters });
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-x"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    className="btn btn-sm border-2 border-neutral-content btn-wide w-full mt-2 btn-base-300"
                                                    onClick={() => {
                                                        const updatedChapters = [...editManga.chapters];
                                                        updatedChapters[index].images.push('');
                                                        setEditManga({ ...editManga, chapters: updatedChapters });
                                                    }}
                                                >
                                                    Add Image
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            className="btn btn-sm border-2 border-neutral-content btn-wide w-full mt-2 btn-base-300"
                                            onClick={addChapterAtTop}
                                        >
                                            Add Chapter
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-base-300 mt-4 btn-wide w-full border-2 border-neutral-content rounded"
                                            disabled={!isEdited || userEmail !== 'revanspstudy28@gmail.com'}
                                        >
                                            SUBMIT
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </dialog>
                <Footer />
            </SidebarDashboard>
        </>
    );
};

export default DashboardManga;
