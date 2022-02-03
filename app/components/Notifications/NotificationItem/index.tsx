
interface NotificationProps {
    notification: Notification;
    onClick: (id: string) => void;
}

function NotificationItem(props: NotificationProps) {
    const {
        notification,
        onClick,
    } = props;

    const {
        title,
        id,
    } = notification;

    const handleOnClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <Message
            message={title}
            onReload={handleOnClick}
        />
    );
}
