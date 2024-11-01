/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import SidebarDashboard from '../components/SidebarDashboard';
import NavbarDashboard from '../components/NavbarDashboard';
import { Link } from 'react-router-dom';
import { Chapter, Manhua } from '../types';
import InputManhua from '../components/InputManhua';
import ButtonManhuaADD from '../components/ButtonManhuaADD';
import ButtonSelectedManhua from '../components/ButtonSelectedManhua';
import TableManhua from '../components/TableManhua';
import PaginationTableManhua from '../components/PaginationTableManhua';
import AddModalManhua from '../components/AddModalManhua';
import ToastManhua from '../components/ToastManhua';

const DashboardManhua: React.FC = () => {
    const [ManhuaData, setManhuaData] = useState<Manhua[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedManhua, setSelectedManhua] = useState<Set<string>>(new Set());
    const itemsPerPage = 40;
    const indexOfLastManhua = currentPage * itemsPerPage;
    const indexOfFirstManhua = indexOfLastManhua - itemsPerPage;
    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [editManhua, setEditManhua] = useState<Manhua | null>(null);
    const userEmail = localStorage.getItem('userEmail') || '';
    
    const [newManhua, setNewManhua] = useState<Manhua>({
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

    useEffect(() => {
        fetch(`https://booksverse-api.vercel.app/manhua?apikey=${import.meta.env.VITE_API_KEY}`, {
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
                const uniqueManhua: Record<string, Manhua> = {};
                data.forEach((Manhua: Manhua) => {
                    if (
                        Manhua.error !== "Failed to scrape details" &&
                        Manhua.imageUrl &&
                        Manhua.imageUrl.startsWith("https://") &&
                        Manhua.title &&
                        Manhua.chapters.length > 0
                    ) {
                        if (!uniqueManhua[Manhua.title]) {
                            uniqueManhua[Manhua.title] = Manhua;
                        }
                    }
                });
                const sortedManhua = Object.values(uniqueManhua).sort((a, b) => {
                    return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
                });
                setManhuaData(sortedManhua);
            })
            .catch((error) => console.error("Error fetching Manhua data:", error));
    }, []);

    const filteredManhua = ManhuaData.filter(Manhua =>
        Manhua.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const currentManhua = filteredManhua.slice(indexOfFirstManhua, indexOfLastManhua);
    const totalPages = Math.ceil(filteredManhua.length / itemsPerPage);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allTitles = new Set(currentManhua.map(Manhua => Manhua.title));
            setSelectedManhua(allTitles);
        } else {
            setSelectedManhua(new Set());
        }
    };

    const handleSelectManhua = (ManhuaTitle: string) => {
        const updatedSelection = new Set(selectedManhua);
        if (updatedSelection.has(ManhuaTitle)) {
            updatedSelection.delete(ManhuaTitle);
        } else {
            updatedSelection.add(ManhuaTitle);
        }
        setSelectedManhua(updatedSelection);
    };

    const openEditModal = (Manhua: Manhua) => {
        setEditManhua(Manhua);
        const dialog = document.getElementById('ManhuaEDIT') as HTMLDialogElement;
        dialog?.showModal();
    };

    const addChapterAtTop = () => {
        const newChapter: Chapter = { number: '', url: '', datePosted: '', images: [''] };
        if (editManhua) {
            const updatedChapters = [newChapter, ...editManhua.chapters];
            setEditManhua({ ...editManhua, chapters: updatedChapters });
        }
    };

    const handleAddManhua = async () => {
        try {
            const response = await fetch(`https://booksverse-api.vercel.app/manhua?apikey=${import.meta.env.VITE_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newManhua),
            });

            if (!response.ok) {
                throw new Error('Failed to add manhua');
            }

            const addedManhua = await response.json();
            setManhuaData([...ManhuaData, addedManhua]);

            setNewManhua({
                error: '',
                title: '',
                imageUrl: '',
                rating: '',
                info: {
                    author: '',
                    genres: [],
                    alternativeTitles: [],
                    status: '',
                    illustrator: '',
                },
                chapters: [],
            });

            const dialog = document.getElementById('ManhuaADD') as HTMLDialogElement;
            dialog?.close();

            showToast("Manhua added successfully!");
        } catch (error) {
            console.error('Error adding manhua:', error);
            showToast("Failed to add manhua.");
        }
    };

    const handleDeleteManhua = async (title: any) => {
        try {
            const response = await fetch(`https://booksverse-api.vercel.app/manhua?apikey=${import.meta.env.VITE_API_KEY}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });

            if (response.ok) {
                setManhuaData(ManhuaData.filter(manhua => manhua.title !== title));
                showToast("Manhua deleted successfully!");
            } else {
                alert("Error: Title not found or failed to delete.");
            }
        } catch (error) {
            console.error("Error deleting manhua:", error);
            showToast("Failed to delete manhua.");
        }
    };

    const handleDeleteSelectedManhua = async () => {
        if (selectedManhua.size === 0) {
            alert("No Manhua selected for deletion.");
            return;
        }

        const confirmed = window.confirm("Are you sure you want to delete the selected Manhua?");
        if (!confirmed) return;

        try {
            const titlesToDelete = Array.from(selectedManhua);
            const responses = await Promise.all(titlesToDelete.map(async (title) => {
                const response = await fetch(`https://booksverse-api.vercel.app/manhua?apikey=${import.meta.env.VITE_API_KEY}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title }),
                });
                return response.ok;
            }));

            const successfulDeletes = responses.filter(response => response).length;
            showToast(`${successfulDeletes} Manhua deleted successfully!`);

            setManhuaData(ManhuaData.filter(manhua => !titlesToDelete.includes(manhua.title)));
            setSelectedManhua(new Set());
        } catch (error) {
            console.error("Error deleting selected Manhua:", error);
            showToast("Failed to delete selected Manhua.");
        }
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editManhua) {
            console.error('editManhua is null');
            return;
        }

        const updatedManhua: Manhua = {
            title: editManhua.title,
            imageUrl: editManhua.imageUrl,
            rating: editManhua.rating,
            info: {
                author: editManhua.info.author,
                genres: editManhua.info.genres.map((genre) => genre.trim()),
            },
            chapters: editManhua.chapters,
        };

        try {
            const response = await fetch(`https://booksverse-api.vercel.app/manhua?apikey=${import.meta.env.VITE_API_KEY}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedManhua),
            });

            if (!response.ok) {
                throw new Error('Failed to update manhua');
            }

            const result = await response.json();
            console.log('Manhua updated successfully:', result);

            setManhuaData(ManhuaData.map(manhua =>
                manhua.title === result.title ? result : manhua
            ));

            setEditManhua(result);
            showToast("Manhua updated successfully!");

            const dialog = document.getElementById('ManhuaEDIT') as HTMLDialogElement;
            dialog?.close();
        } catch (error) {
            console.error('Error:', error);
            showToast("Failed to update manhua.");
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (!editManhua) return;

        if (field === 'genres') {
            const genresArray = e.target.value.split(',').map(genre => genre.trim());
            setEditManhua({
                ...editManhua,
                info: {
                    ...editManhua.info,
                    genres: genresArray,
                },
            });
        } else if (field === 'author') {
            setEditManhua({
                ...editManhua,
                info: {
                    ...editManhua.info,
                    author: e.target.value,
                },
            });
        } else {
            setEditManhua({
                ...editManhua,
                [field]: e.target.value,
            });
        }
    };

    const showToast = (message: React.SetStateAction<string>) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => {
            setToastVisible(false);
        }, 2700);
    };

    return (
        <>
            <SidebarDashboard>
                <NavbarDashboard />
                <div className="flex-grow flex flex-col p-4">
                    <div className="breadcrumbs text-xs">
                        <ul>
                            <li><Link to='/dashboard'>Dashboard</Link></li>
                            <li><Link to="/Manhua-tab">Manhua Tab</Link></li>
                        </ul>
                    </div>
                    <div className="bg-base-300 rounded border-2 border-neutral-content shadow-xl p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <InputManhua
                                searchTerm={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                filteredLength={filteredManhua.length}
                            />
                            <ButtonManhuaADD
                                onClick={() => {
                                    const dialog = document.getElementById('ManhuaADD') as HTMLDialogElement;
                                    dialog?.showModal();
                                }}
                            />
                            <ButtonSelectedManhua
                                handleDelete={handleDeleteSelectedManhua}
                                userEmail={userEmail || ''}
                                selectedManhuaSize={selectedManhua.size}
                            />

                        </div>
                        <div className="overflow-x-auto pb-2">
                            <TableManhua
                                currentManhua={currentManhua}
                                selectedManhua={selectedManhua}
                                handleSelectAll={handleSelectAll}
                                handleSelectManhua={handleSelectManhua}
                                openEditModal={openEditModal}
                                handleDeleteManhua={handleDeleteManhua}
                                userEmail={userEmail}
                                indexOfFirstManhua={indexOfFirstManhua}
                            />
                            {toastVisible && (
                                <ToastManhua message={toastMessage} visible={toastVisible} />
                            )}
                        </div>
                        <div className="mt-4">
                            <div className="overflow-x-auto pb-3">
                                <PaginationTableManhua
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <AddModalManhua
                    newManhua={newManhua}
                    setNewManhua={setNewManhua}
                    handleAddManhua={handleAddManhua}
                    userEmail={userEmail}
                />
                <dialog id="ManhuaEDIT" className="modal">
                    <div className="modal-box w-11/12 max-w-7xl border-2 border-neutral-content rounded">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        {editManhua && (
                            <>
                                <form method="dialog" onSubmit={handleEditSubmit}>
                                    <h3 className="font-bold text-lg">EDIT</h3>
                                    <div className="py-4">
                                        <div>
                                            <label className="label">Title :</label>
                                            <input
                                                type="text"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={editManhua.title}
                                                onChange={(e) => handleEditChange(e, 'title')}
                                                placeholder="Enter Manhua title"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Image URL :</label>
                                            <input
                                                type="url"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={editManhua.imageUrl}
                                                onChange={(e) => handleEditChange(e, 'imageUrl')}
                                                placeholder="Enter image URL"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Rating :</label>
                                            <input
                                                type="number"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={editManhua.rating}
                                                onChange={(e) => handleEditChange(e, 'rating')}
                                                placeholder="Enter rating"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Author :</label>
                                            <input
                                                type="text"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={editManhua?.info.author || ''}
                                                onChange={(e) => handleEditChange(e, 'author')}
                                                placeholder="Enter author name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Genres :</label>
                                            <input
                                                type="text"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                value={(editManhua?.info.genres || []).join(', ')}
                                                onChange={(e) => handleEditChange(e, 'genres')}
                                                placeholder="Enter genres (comma separated)"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label mt-2">Chapters :</label>
                                            {editManhua.chapters.map((chapter, index) => (
                                                <div key={index} className="mb-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="text"
                                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                            placeholder={`Chapter ${index + 1} Number`}
                                                            value={chapter.number}
                                                            onChange={(e) => {
                                                                const updatedChapters = [...editManhua.chapters];
                                                                updatedChapters[index].number = e.target.value;
                                                                setEditManhua({ ...editManhua, chapters: updatedChapters });
                                                            }}
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm rounded btn-base-200 border-2 border-neutral-content ml-2"
                                                            onClick={() => {
                                                                const updatedChapters = [...editManhua.chapters];
                                                                updatedChapters.splice(index, 1);
                                                                setEditManhua({ ...editManhua, chapters: updatedChapters });
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
                                                                    const updatedChapters = [...editManhua.chapters];
                                                                    updatedChapters[index].images[imgIndex] = e.target.value;
                                                                    setEditManhua({ ...editManhua, chapters: updatedChapters });
                                                                }}
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-base-300 border-2 border-neutral-content rounded ml-2"
                                                                onClick={() => {
                                                                    const updatedChapters = [...editManhua.chapters];
                                                                    updatedChapters[index].images.splice(imgIndex, 1);
                                                                    setEditManhua({ ...editManhua, chapters: updatedChapters });
                                                                }}
                                                            >
                                                                <i className="fa-solid fa-x"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        className="btn btn-sm border-2 border-neutral-content btn-wide w-full mt-2 btn-base-300"
                                                        onClick={() => {
                                                            const updatedChapters = [...editManhua.chapters];
                                                            updatedChapters[index].images.push('');
                                                            setEditManhua({ ...editManhua, chapters: updatedChapters });
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
                                                disabled={userEmail !== 'revanspstudy28@gmail.com'}
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

export default DashboardManhua;
