type Check<T> = T extends string[] ? string[] : T extends string ? string : undefined;

export type EnumFix<T, F> = T extends Record<string, unknown>[] ? (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends any[] ? EnumFix<T[number], F>[] : T
) : ({
    [K in keyof T]: K extends F ? Check<T[K]> : EnumFix<T[K], F>;
})

export type EnumOption = {
    name: string;
    description?: string | undefined | null;
};

export function enumKeySelector(option: EnumOption) {
    return option.name;
}

export function enumLabelSelector(option: EnumOption) {
    return option.description ?? option.name;
}
