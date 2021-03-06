import {
    ObjectSchema,
    PartialForm,
    emailCondition,
    requiredCondition,
    requiredStringCondition,
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
    PurgeNull,
    integerCondition,
} from '@togglecorp/toggle-form';

import { EnumFix } from '#utils/types';
import { RegisterInputType } from '#generated/types';

export type RegisterFormType = PurgeNull<RegisterInputType>;

export type PartialRegisterFormType = PartialForm<EnumFix<RegisterFormType, 'userType'>>;

export type RegisterFormSchema = ObjectSchema<PartialRegisterFormType, PartialRegisterFormType>;
export type RegisterFormSchemaFields = ReturnType<RegisterFormSchema['fields']>;

export type InstitutionType = NonNullable<PartialRegisterFormType['institution']>;
export type InstitutionSchema = ObjectSchema<PartialForm<InstitutionType>, PartialRegisterFormType>;
export type InstitutionSchemaFields = ReturnType<InstitutionSchema['fields']>;

export type PublisherType = NonNullable<PartialRegisterFormType['publisher']>;
export type PublisherSchema = ObjectSchema<PartialForm<PublisherType>, PartialRegisterFormType>;
export type PublisherSchemaFields = ReturnType<PublisherSchema['fields']>;

export type SchoolType = NonNullable<PartialRegisterFormType['school']>;
export type SchoolSchema = ObjectSchema<PartialForm<SchoolType>, PartialRegisterFormType>;
export type SchoolSchemaFields = ReturnType<SchoolSchema['fields']>;

export const schema = (captchaRequired: boolean): RegisterFormSchema => ({
    fields: (currentFormValue): RegisterFormSchemaFields => {
        let baseSchema: RegisterFormSchemaFields = {
            email: [emailCondition, requiredStringCondition],
            userType: [requiredCondition],
            password: [
                requiredStringCondition,
                lengthGreaterThanCondition(4),
                lengthSmallerThanCondition(129),
            ],
            phoneNumber: [
                requiredStringCondition,
                // NOTE: from 6 digit to 16 digit
                // is usually the case for Nepali phone numbers
                lengthGreaterThanCondition(5),
                lengthSmallerThanCondition(15),
            ],
        };

        if (captchaRequired) {
            baseSchema = {
                ...baseSchema,
                captcha: [requiredStringCondition],
            };
        }

        const extraSchema = {
            name: [requiredStringCondition],
            municipality: [requiredStringCondition],
            wardNumber: [integerCondition, requiredCondition],
            localAddress: [requiredStringCondition],
            // panNumber: [],
            // vatNumber: [],
        };

        const publisherExtraSchema = {
            ...extraSchema,
            panNumber: [],
            vatNumber: [],
        };
        const schoolSchema = {
            ...extraSchema,
            panNumber: [],
            schoolId: [],
        };

        switch (currentFormValue?.userType) {
            /*
           case 'INDIVIDUAL_USER':
               return {
                   ...baseSchema,
                   firstName: [requiredCondition],
                   lastName: [requiredCondition],
               };
           */
            case 'INSTITUTIONAL_USER':
                return {
                    ...baseSchema,
                    institution: {
                        fields: () => extraSchema,
                    },
                };
            case 'PUBLISHER':
                return {
                    ...baseSchema,
                    publisher: {
                        fields: () => publisherExtraSchema,
                        validation: (value) => {
                            if (value && !value.panNumber && !value.vatNumber) {
                                return 'Either pan number or vat number is required';
                            }
                            return undefined;
                        },
                    },
                };
            case 'SCHOOL_ADMIN':
                return {
                    ...baseSchema,
                    school: {
                        fields: () => schoolSchema,
                        validation: (value) => {
                            if (value && !value.panNumber && !value.schoolId) {
                                return 'Either pan number or school id is required';
                            }
                            return undefined;
                        },
                    },
                };
            default:
                return baseSchema;
        }
    },
});
