import { useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserConnections, addUserConnection, removeUserConnection, resetMessages, selectAllConnections } from '../features/userConnectionSlice';
import { User as UserConnectionType } from '../types';
import { AppDispatch, RootState } from '../store';

const useUserConnections = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, success } = useSelector((state: RootState) => state.userConnection);
    const allConnections = useSelector(selectAllConnections);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredConnections, setFilteredConnections] = useState<UserConnectionType[]>([]);
    const [userName, setUserName] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const loadConnections = async () => {
            await dispatch(fetchUserConnections());
        };
        loadConnections();
    }, [dispatch]);

    useEffect(() => {
        // Filter connections based on the search term
        setFilteredConnections(
            allConnections.filter(
                (connection) =>
                    connection.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    connection.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [allConnections, searchQuery]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleAddConnection = async (e: FormEvent) => {
        e.preventDefault();
        await dispatch(addUserConnection({ connectionUsername: userName }));
        setUserName('');
    };

    const handleRemoveConnection = async (currentConnectionOnMenu: UserConnectionType | null) => {
        const userId = currentConnectionOnMenu?._id;
        if (userId) {
            await dispatch(removeUserConnection(userId));
        }
    };

    useEffect(() => {
        if (error || success) {
            setOpenSnackbar(true);
        } else {
            setOpenSnackbar(false);
        }
    }, [error, success]);

    const handleSnackbarClose = () => {
        dispatch(resetMessages());
        setOpenSnackbar(false);
    };

    return {
        filteredConnections,
        searchQuery,
        userName,
        loading,
        error,
        success,
        openSnackbar,
        handleSnackbarClose,
        setUserName,
        handleSearchChange,
        handleAddConnection,
        handleRemoveConnection,
    };
};

export default useUserConnections;
