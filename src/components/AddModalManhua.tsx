import React, { useEffect, useState } from 'react';
import { Chapter } from '../types';
import { AddModalManhuaProps } from '../types';

const AddModalManhua: React.FC<AddModalManhuaProps> = ({ newManhua, setNewManhua, handleAddManhua, userEmail }) => {
    const [isFormValid, setIsFormValid] = useState<boolean>(false); 

    const handleNewManhuaChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (field === 'genres') {
            const genresArray = e.target.value.split(',').map(g => g.trim());
            setNewManhua(prev => ({
                ...prev,
                info: {
                    ...prev.info,
                    genres: genresArray,
                },
            }));
        } else if (['author', 'illustrator', 'status'].includes(field)) {
            setNewManhua(prev => ({
                ...prev,
                info: {
                    ...prev.info,
                    [field]: e.target.value,
                },
            }));
        } else {
            setNewManhua(prev => ({
                ...prev,
                [field]: e.target.value,
            }));
        }
    };

    useEffect(() => {
        const { title, imageUrl, info } = newManhua;
        const { author, genres } = info;

        const isValid = !!(title && imageUrl && author && genres.length > 0 && newManhua.chapters.length > 0 && newManhua.chapters.every(chapter => chapter.number && chapter.images.length > 0));
        setIsFormValid(isValid);
    }, [newManhua]);

    return (
        <dialog id="ManhuaADD" className="modal">
            <div className="modal-box w-11/12 max-w-7xl border-2 border-neutral-content rounded">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <form method="dialog" onSubmit={(e) => { e.preventDefault(); handleAddManhua(); }}>
                    <h3 className="font-bold text-lg">ADD</h3>
                    <div className="py-4">
                        <div>
                            <label className="label">Title :</label>
                            <input
                                type="text"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhua.title}
                                onChange={(e) => handleNewManhuaChange(e, 'title')}
                                placeholder="Enter Manhua title"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Image URL :</label>
                            <input
                                type="url"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhua.imageUrl}
                                onChange={(e) => handleNewManhuaChange(e, 'imageUrl')}
                                placeholder="Enter image URL"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Rating :</label>
                            <input
                                type="number"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhua.rating}
                                onChange={(e) => handleNewManhuaChange(e, 'rating')}
                                placeholder="Enter rating"
                            />
                        </div>
                        <div>
                            <label className="label">Author :</label>
                            <input
                                type="text"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhua.info.author}
                                onChange={(e) => handleNewManhuaChange(e, 'author')}
                                placeholder="Enter author name"
                            />
                        </div>
                        <div>
                            <label className="label">Genres :</label>
                            <input
                                type="text"
                                className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                value={newManhua.info.genres.join(', ')}
                                onChange={(e) => handleNewManhuaChange(e, 'genres')}
                                placeholder="Enter genres (comma separated)"
                            />
                        </div>
                        <div>
                            <label className="label mt-2">Chapters :</label>
                            {newManhua.chapters.map((chapter, index) => (
                                <div key={index} className="mb-4">
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            className="input input-bordered border-2 border-neutral-content bg-base-200 w-full text-xs input-sm"
                                            placeholder={`Chapter ${index + 1} Number`}
                                            value={chapter.number}
                                            onChange={(e) => {
                                                const updatedChapters = [...newManhua.chapters];
                                                updatedChapters[index].number = e.target.value;
                                                setNewManhua({ ...newManhua, chapters: updatedChapters });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-base-200 border-2 border-neutral-content rounded ml-2"
                                            onClick={() => {
                                                const updatedChapters = [...newManhua.chapters];
                                                updatedChapters.splice(index, 1);
                                                setNewManhua({ ...newManhua, chapters: updatedChapters });
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
                                                    const updatedChapters = [...newManhua.chapters];
                                                    updatedChapters[index].images[imgIndex] = e.target.value;
                                                    setNewManhua({ ...newManhua, chapters: updatedChapters });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-base-300 border-2 border-neutral-content rounded ml-2"
                                                onClick={() => {
                                                    const updatedChapters = [...newManhua.chapters];
                                                    updatedChapters[index].images.splice(imgIndex, 1);
                                                    setNewManhua({ ...newManhua, chapters: updatedChapters });
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
                                            const updatedChapters = [...newManhua.chapters];
                                            updatedChapters[index].images.push('');
                                            setNewManhua({ ...newManhua, chapters: updatedChapters });
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
                                        images: ['']
                                    };
                                    setNewManhua({ ...newManhua, chapters: [...newManhua.chapters, newChapter] });
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

export default AddModalManhua;
