import React, { useEffect, useState } from 'react';
import { Chapter } from '../types';
import { Props } from '../types';

const AddModalManhwa: React.FC<Props> = ({ newManhwa, setNewManhwa, handleAddManhwa, userEmail }) => {
    const [isFormValid, setIsFormValid] = useState(false);

    const handleNewManhwaChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (field === 'genres') {
            const genresArray = e.target.value.split(',').map(g => g.trim());
            setNewManhwa(prev => ({
                ...prev,
                info: {
                    ...prev.info,
                    genres: genresArray,
                },
            }));
        } else if (['author', 'illustrator', 'status'].includes(field)) {
            setNewManhwa(prev => ({
                ...prev,
                info: {
                    ...prev.info,
                    [field]: e.target.value,
                },
            }));
        } else {
            setNewManhwa(prev => ({
                ...prev,
                [field]: e.target.value,
            }));
        }
    };


    useEffect(() => {
        const { title, imageUrl, info } = newManhwa;
        const { author, genres } = info;

        const isValid = !!(title && imageUrl && author && genres.length > 0);
        setIsFormValid(isValid);
    }, [newManhwa]);


    return (
        <dialog id="ManhwaADD" className="modal">
            <div className="modal-box w-11/12 max-w-7xl border-2 border-neutral-content rounded">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <form method="dialog" onSubmit={(e) => { e.preventDefault(); handleAddManhwa(); }}>
                    <h3 className="font-bold text-lg">ADD</h3>
                    <div className="py-4">
                        <div>
                            <label className="label">Title :</label>
                            <input
                                type="text"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhwa.title}
                                onChange={(e) => handleNewManhwaChange(e, 'title')}
                                placeholder="Enter Manhwa title"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Image URL :</label>
                            <input
                                type="url"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhwa.imageUrl}
                                onChange={(e) => handleNewManhwaChange(e, 'imageUrl')}
                                placeholder="Enter image URL"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Rating :</label>
                            <input
                                type="number"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhwa.rating}
                                onChange={(e) => handleNewManhwaChange(e, 'rating')}
                                placeholder="Enter rating"
                            />
                        </div>
                        <div>
                            <label className="label">Author :</label>
                            <input
                                type="text"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhwa.info.author}
                                onChange={(e) => handleNewManhwaChange(e, 'author')}
                                placeholder="Enter author name"
                            />
                        </div>
                        <div>
                            <label className="label">Genres :</label>
                            <input
                                type="text"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhwa.info.genres.join(', ')}
                                onChange={(e) => handleNewManhwaChange(e, 'genres')}
                                placeholder="Enter genres (comma separated)"
                            />
                        </div>
                        <div>
                            <label className="label mt-2">Chapters :</label>
                            {newManhwa.chapters.map((chapter, index) => (
                                <div key={index}>
                                    <div className="flex items-center py-1">
                                        <input
                                            type="text"
                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                            placeholder={`Chapter ${index + 1} Number`}
                                            value={chapter.number}
                                            onChange={(e) => {
                                                const updatedChapters = [...newManhwa.chapters];
                                                updatedChapters[index].number = e.target.value;
                                                setNewManhwa({ ...newManhwa, chapters: updatedChapters });
                                            }}
                                        />
                                    </div>
                                    {chapter.images.map((image, imgIndex) => (
                                        <div key={imgIndex} className="flex items-center py-1">
                                            <input
                                                type="url"
                                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                                placeholder={`Chapter ${index + 1} Image ${imgIndex + 1}`}
                                                value={image}
                                                onChange={(e) => {
                                                    const updatedChapters = [...newManhwa.chapters];
                                                    updatedChapters[index].images[imgIndex] = e.target.value;
                                                    setNewManhwa({ ...newManhwa, chapters: updatedChapters });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-base-300 border-2 border-neutral-content rounded ml-2"
                                                onClick={() => {
                                                    const updatedChapters = [...newManhwa.chapters];
                                                    updatedChapters[index].images.splice(imgIndex, 1);
                                                    setNewManhwa({ ...newManhwa, chapters: updatedChapters });
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
                                            const updatedChapters = [...newManhwa.chapters];
                                            updatedChapters[index].images.push('');
                                            setNewManhwa({ ...newManhwa, chapters: updatedChapters });
                                        }}
                                    >
                                        Add Image
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm border-2 border-neutral-content btn-wide w-full mt-2 btn-base-300"
                                onClick={() => {
                                    const newChapter: Chapter = {
                                        number: '',
                                        url: '',
                                        datePosted: '',
                                        images: [''],
                                    };
                                    setNewManhwa({ ...newManhwa, chapters: [...newManhwa.chapters, newChapter] });
                                }}
                            >
                                Add Chapter
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-sm btn-base-300 mt-4 btn-wide w-full border-2 border-neutral-content rounded"
                        disabled={!isFormValid || userEmail !== 'revanspstudy28@gmail.com'}
                    >
                        SUBMIT
                    </button>
                </form>
            </div>
        </dialog>
    );
};

export default AddModalManhwa;
