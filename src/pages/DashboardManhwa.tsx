
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import SidebarDashboard from '../components/SidebarDashboard';
import NavbarDashboard from '../components/NavbarDashboard';
import { Link } from 'react-router-dom';
import { Chapter, Manhwa } from '../types';
import PaginationTableManhwa from '../components/PaginationTableManhwa';
import InputManhwa from '../components/InputManhwa';
import ButtonManhwaADD from '../components/ButtonManhwaADD';
import AddModalManhwa from '../components/AddModalManhwa';
import TableManhwa from '../components/TableManhwa';
import ToastManhwa from '../components/ToastManhwa';

const DashboardManhwa: React.FC = () => {
    const [ManhwaData, setManhwaData] = useState<Manhwa[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedManhwa, setSelectedManhwa] = useState<Set<string>>(new Set());
    const [editManhwa, setEditManhwa] = useState<Manhwa | null>(null);
    const itemsPerPage = 40;
    const indexOfLastManhwa = currentPage * itemsPerPage;
    const indexOfFirstManhwa = indexOfLastManhwa - itemsPerPage;
    const [isChanged, setIsChanged] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const userEmail = localStorage.getItem('userEmail') || '';

    const [newManhwa, setNewManhwa] = useState<Manhwa>({
        error: '',
        title: '',
        url: '',
        imageUrl: '',
        type: '',
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

    const filteredManhwa = ManhwaData.filter(Manhwa =>
        Manhwa.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const currentManhwa = filteredManhwa.slice(indexOfFirstManhwa, indexOfLastManhwa);
    const totalPages = Math.ceil(filteredManhwa.length / itemsPerPage);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allTitles = new Set(currentManhwa.map(Manhwa => Manhwa.title));
            setSelectedManhwa(allTitles);
        } else {
            setSelectedManhwa(new Set());
        }
    };

    const handleSelectManhwa = (ManhwaTitle: string) => {
        const updatedSelection = new Set(selectedManhwa);
        if (updatedSelection.has(ManhwaTitle)) {
            updatedSelection.delete(ManhwaTitle);
        } else {
            updatedSelection.add(ManhwaTitle);
        }
        setSelectedManhwa(updatedSelection);
    };

    const openEditModal = (Manhwa: Manhwa) => {
        setEditManhwa(Manhwa);
        const dialog = document.getElementById('ManhwaEDIT') as HTMLDialogElement;
        dialog?.showModal();
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (editManhwa) {
            setIsChanged(true);
            if (field === 'genres') {
                const genresArray = e.target.value.split(',').map(g => g.trim());
                setEditManhwa({
                    ...editManhwa,
                    info: {
                        ...editManhwa.info,
                        genres: genresArray,
                    },
                });
            } else if (field === 'author') {
                setEditManhwa({
                    ...editManhwa,
                    info: {
                        ...editManhwa.info,
                        author: e.target.value,
                    },
                });
            } else {
                setEditManhwa({
                    ...editManhwa,
                    [field]: e.target.value,
                });
            }
        }
    };

    const addChapterAtTop = () => {
        const newChapter: Chapter = { number: '', url: '', datePosted: '', images: [''] };
        if (editManhwa) {
            const updatedChapters = [newChapter, ...editManhwa.chapters];
            setEditManhwa({ ...editManhwa, chapters: updatedChapters });
        }
    };

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
                data.forEach((Manhwa: Manhwa) => {
                    if (
                        Manhwa.error !== "Failed to scrape details" &&
                        Manhwa.imageUrl &&
                        Manhwa.imageUrl.startsWith("https://") &&
                        Manhwa.title &&
                        Manhwa.chapters.length > 0
                    ) {
                        if (!uniqueManhwa[Manhwa.title]) {
                            uniqueManhwa[Manhwa.title] = Manhwa;
                        }
                    }
                });
                const sortedManhwa = Object.values(uniqueManhwa).sort((a, b) => {
                    return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
                });
                setManhwaData(sortedManhwa);
            })
            .catch((error) => console.error("Error fetching Manhwa data:", error));
    }, []);

    const handleEditSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        try {
            const response = await fetch(`https://booksverse-api.vercel.app/manhwa?apikey=${import.meta.env.VITE_API_KEY}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editManhwa),
            });

            if (response.ok) {
                const updatedManhwa = await response.json();
                console.log('Manhwa updated:', updatedManhwa);

                const dialog = document.getElementById('ManhwaEDIT') as HTMLDialogElement;
                dialog?.close();

                setToastMessage('Manhwa updated successfully!');
                setToastVisible(true);
            } else {
                const error = await response.json();
                console.error('Error updating manhwa:', error);
                setToastMessage(`Error updating Manhwa: ${error.message}`);
                setToastVisible(true);
            }
        } catch (error) {
            console.error('Network error:', error);
            setToastMessage('Network error occurred while updating Manhwa.');
            setToastVisible(true);
        }
    };

    const handleAddManhwa = async () => {
        try {
            const response = await fetch(`https://booksverse-api.vercel.app/manhwa?apikey=${import.meta.env.VITE_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newManhwa),
            });

            if (!response.ok) {
                throw new Error('Failed to add Manhwa');
            }

            const addedManhwa = await response.json();
            setManhwaData([...ManhwaData, addedManhwa]);

            setNewManhwa({
                error: '',
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

            const dialog = document.getElementById('ManhwaADD') as HTMLDialogElement;
            dialog?.close();

            setToastMessage('Manhwa added successfully!');
            setToastVisible(true);

        } catch (error) {
            console.error('Error adding Manhwa:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setNewManhwa((prev) => ({ ...prev, error: errorMessage }));
            setToastMessage(`Error adding Manhwa: ${errorMessage}`);
            setToastVisible(true);
        }
    };

    const handleDeleteManhwa = async (manhwaTitle: string) => {
        const response = await fetch(`https://booksverse-api.vercel.app/manhwa?apikey=${import.meta.env.VITE_API_KEY}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titles: [manhwaTitle] }),
        });

        if (response.ok) {
            setManhwaData(ManhwaData.filter((manhwa) => manhwa.title !== manhwaTitle));
            console.log('Manhwa deleted successfully');
            setToastMessage('Manhwa deleted successfully!');
            setToastVisible(true);
        } else {
            const errorData = await response.json();
            console.error('Error deleting Manhwa:', errorData.error);
            setToastMessage(`Error deleting Manhwa: ${errorData.error}`);
            setToastVisible(true);
        }
    };

    const handleDeleteSelectedManhwa = async () => {
        const titlesToDelete = Array.from(selectedManhwa);

        try {
            const response = await fetch(`https://booksverse-api.vercel.app/manhwa?apikey=${import.meta.env.VITE_API_KEY}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titles: titlesToDelete }),
            });

            if (response.ok) {
                setManhwaData(ManhwaData.filter((manhwa) => !titlesToDelete.includes(manhwa.title)));
                setSelectedManhwa(new Set());
                console.log('Selected Manhwa deleted successfully');
                setToastMessage('Selected Manhwa deleted successfully!');
                setToastVisible(true);
            } else {
                const errorData = await response.json();
                console.error('Error deleting selected Manhwa:', errorData.error);
                setToastMessage(`Error deleting selected Manhwa: ${errorData.error}`);
                setToastVisible(true);
            }
        } catch (error) {
            console.error('Network error:', error);
            setToastMessage('Network error occurred while deleting selected Manhwa.');
            setToastVisible(true);
        }
    };

    React.useEffect(() => {
        if (toastVisible) {
            const timer = setTimeout(() => setToastVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastVisible]);

    return (
        <>
            <SidebarDashboard>
                <NavbarDashboard />
                <div className="flex-grow flex flex-col p-4">
                    <div className="breadcrumbs text-xs">
                        <ul>
                            <li><Link to='/dashboard'>Dashboard</Link></li>
                            <li><Link to="/Manhwa-tab">Manhwa Tab</Link></li>
                        </ul>
                    </div>
                    <div className="bg-base-300 rounded border-2 border-neutral-content shadow-xl p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <InputManhwa
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filteredManhwa={filteredManhwa}
                            />
                            <ButtonManhwaADD dialogId="ManhwaADD" />
                            <button
                                onClick={handleDeleteSelectedManhwa}
                                disabled={userEmail !== 'revanspstudy28@gmail.com' || selectedManhwa.size === 0}
                                className={`btn btn-sm border-2 border-neutral-content rounded btn-base-200 ${userEmail !== 'revanspstudy28@gmail.com' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <i className="fa-solid fa-delete-left"></i>
                            </button>
                        </div>
                        <div className="overflow-x-auto pb-2">
                            <TableManhwa
                                currentManhwa={currentManhwa}
                                selectedManhwa={selectedManhwa}
                                handleSelectAll={handleSelectAll}
                                handleSelectManhwa={handleSelectManhwa}
                                handleDeleteManhwa={handleDeleteManhwa}
                                openEditModal={openEditModal}
                                userEmail={userEmail}
                                indexOfFirstManhwa={indexOfFirstManhwa}
                            />
                            <ToastManhwa toastVisible={toastVisible} toastMessage={toastMessage} />
                        </div>
                        <div className="mt-4">
                            <div className="overflow-x-auto pb-3">
                                <PaginationTableManhwa
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <AddModalManhwa
                    newManhwa={newManhwa}
                    setNewManhwa={setNewManhwa}
                    handleAddManhwa={handleAddManhwa}
                    userEmail={userEmail}
                />
                <dialog id="ManhwaEDIT" className="modal">
                    <div className="modal-box w-11/12 max-w-7xl border-2 border-neutral-content rounded">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        {editManhwa && (
                            <>
                                <form onSubmit={handleEditSubmit}>
                                    <h3 className="font-bold text-lg">EDIT</h3>
                                    <div className="py-4">
                                        <div>
                                            <label className="label">Title :</label>
                                            <input
                                                type="text"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={editManhwa.title}
                                                onChange={(e) => handleEditChange(e, 'title')}
                                                placeholder="Enter Manhwa title"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Image URL :</label>
                                            <input
                                                type="url"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={editManhwa.imageUrl}
                                                onChange={(e) => handleEditChange(e, 'imageUrl')}
                                                placeholder="Enter image URL"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Rating :</label>
                                            <input
                                                type="number"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={editManhwa.rating}
                                                onChange={(e) => handleEditChange(e, 'rating')}
                                                placeholder="Enter rating"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Author :</label>
                                            <input
                                                type="text"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={editManhwa?.info.author || ''}
                                                onChange={(e) => handleEditChange(e, 'author')}
                                                placeholder="Enter author name"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Genres :</label>
                                            <input
                                                type="text"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={(editManhwa?.info.genres || []).join(', ')}
                                                onChange={(e) => handleEditChange(e, 'genres')}
                                                placeholder="Enter genres (comma separated)"
                                            />
                                        </div>
                                        <div>
                                            <label className="label mt-2">Chapters :</label>
                                            {editManhwa.chapters.map((chapter, index) => (
                                                <div key={index} className="mb-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="text"
                                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                            placeholder={`Chapter ${index + 1} Number`}
                                                            value={chapter.number}
                                                            onChange={(e) => {
                                                                const updatedChapters = [...editManhwa.chapters];
                                                                updatedChapters[index].number = e.target.value;
                                                                setEditManhwa({ ...editManhwa, chapters: updatedChapters });
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm rounded btn-base-200 border-2 border-neutral-content ml-2"
                                                            onClick={() => {
                                                                const updatedChapters = [...editManhwa.chapters];
                                                                updatedChapters.splice(index, 1);
                                                                setEditManhwa({ ...editManhwa, chapters: updatedChapters });
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
                                                                    const updatedChapters = [...editManhwa.chapters];
                                                                    updatedChapters[index].images[imgIndex] = e.target.value;
                                                                    setEditManhwa({ ...editManhwa, chapters: updatedChapters });
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-base-300 border-2 border-neutral-content rounded ml-2"
                                                                onClick={() => {
                                                                    const updatedChapters = [...editManhwa.chapters];
                                                                    updatedChapters[index].images.splice(imgIndex, 1);
                                                                    setEditManhwa({ ...editManhwa, chapters: updatedChapters });
                                                                }}
                                                            >
                                                                <i className="fa-solid fa-x"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        className="btn btn-sm border-2 border-neutral-content btn-wide w-full mt-2 btn-base-300"
                                                        onClick={() => {
                                                            const updatedChapters = [...editManhwa.chapters];
                                                            updatedChapters[index].images.push('');
                                                            setEditManhwa({ ...editManhwa, chapters: updatedChapters });
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
                                                disabled={!isChanged || userEmail !== 'revanspstudy28@gmail.com'}
                                            >
                                                SUBMIT
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </dialog>
                <Footer />
            </SidebarDashboard>
        </>
    );
};

export default DashboardManhwa;
