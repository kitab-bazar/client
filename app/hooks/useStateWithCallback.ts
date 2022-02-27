import React, {
    useState,
    useCallback,
} from 'react';

export default function useStateWithCallback<S>(
    defaultValue: S | (() => S),
    callback: (value: number) => void,
): [S, React.Dispatch<React.SetStateAction<S>>] {
    const [state, setState] = useState(defaultValue);

    const handler: typeof setState = (value) => {
        setState(value);
        callback(1);
    };

    const handleChange = useCallback(
        handler,
        [callback],
    );

    return [state, handleChange];
}
