/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Chapter {
    number: string;
    url: string;
    datePosted: string;
    images: string[];
}

export interface Manhwa {
    error?: string;
    title: string;
    url?: string;
    imageUrl: string;
    type?: string;
    rating: string;
    info: {
        alternativeTitles?: string[];
        status?: string;
        author: string;
        illustrator?: string;
        genres: string[];
    };
    chapters: Chapter[];
}

export interface AddModalManhuaProps {
    newManhua: Manhua;
    setNewManhua: React.Dispatch<React.SetStateAction<Manhua>>;
    handleAddManhua: () => void;
    userEmail: string;
}

export interface Manhua {
    error?: string;
    title: string;
    url?: string;
    imageUrl: string;
    type?: string;
    rating: string;
    info: {
        alternativeTitles?: string[];
        status?: string;
        author: string;
        illustrator?: string;
        genres: string[];
    };
    chapters: Chapter[];
}

export interface Manga {
    title: string;
    imageUrl: string;
    rating: string;
    url?: string;
    type?: string;
    error?: string;
    info: {
        alternativeTitles?: string[];
        status?: string;
        author: string;
        illustrator?: string;
        genres: string[];
    };
    chapters: Chapter[];
}

export interface LayoutProps {
    children: React.ReactNode;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (email: string, role: string) => void;
    logout: () => void;
}

export interface Props {
    newManhwa: Manhwa;
    setNewManhwa: React.Dispatch<React.SetStateAction<Manhwa>>;
    handleAddManhwa: () => void;
    userEmail: string;
}

export interface ButtonManhuaADDProps {
    onClick: () => void;
}

export interface ButtonManhwaADDProps {
    dialogId: string;
}

export interface ButtonSelectedManhuaProps {
    handleDelete: () => void;
    userEmail: string;
    selectedManhuaSize: number;
}

export interface InputManhuaProps {
    searchTerm: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredLength: number;
}

export interface InputManhwaProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredManhwa: any[];
}

export interface PaginationTableManhuaProps {
    totalPages: number;
    currentPage: number;
    handlePageChange: (page: number) => void;
}

export interface PaginationTableManhwaProps {
    totalPages: number;
    currentPage: number;
    handlePageChange: (page: number) => void;
}

export interface SidebarDashboardProps {
    children: React.ReactNode;
}

export interface TableManhuaProps {
    currentManhua: Manhua[];
    selectedManhua: Set<string>;
    handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectManhua: (title: string) => void;
    openEditModal: (manhua: Manhua) => void;
    handleDeleteManhua: (title: string) => void;
    userEmail: string | null;
    indexOfFirstManhua: number;
}

export interface TableManhwaProps {
    currentManhwa: Manhwa[];
    selectedManhwa: Set<string>;
    handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectManhwa: (title: string) => void;
    handleDeleteManhwa: (title: string) => void;
    openEditModal: (manhwa: Manhwa) => void;
    userEmail: string;
    indexOfFirstManhwa: number;
}

export interface ToastManhuaProps {
    message: string;
    visible: boolean;
}

export interface ToastManhwaProps {
    toastVisible: boolean;
    toastMessage: string;
}