import PropTypes from 'prop-types';
export interface AccountMenuOptions {
    canHaveSession: boolean;
    canRegister?: boolean;
    canLogin?: boolean;
    canLogout?: boolean;
    avatarUrl?: string;
    myStuffUrl?: string;
    profileUrl?: string;
    myClassesUrl?: string;
    myClassUrl?: string;
    accountSettingsUrl?: string;
}
export declare const AccountMenuOptionsPropTypes: PropTypes.Requireable<PropTypes.InferProps<{
    canHaveSession: PropTypes.Validator<boolean>;
    canRegister: PropTypes.Requireable<boolean>;
    canLogin: PropTypes.Requireable<boolean>;
    canLogout: PropTypes.Requireable<boolean>;
    avatarUrl: PropTypes.Requireable<string>;
    myStuffUrl: PropTypes.Requireable<string>;
    profileUrl: PropTypes.Requireable<string>;
    myClassesUrl: PropTypes.Requireable<string>;
    myClassUrl: PropTypes.Requireable<string>;
    accountSettingsUrl: PropTypes.Requireable<string>;
}>>;
