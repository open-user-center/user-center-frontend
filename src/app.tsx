import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import {BookOutlined, LinkOutlined} from '@ant-design/icons';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import {PageLoading, SettingDrawer} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from 'umi';
import {history, Link} from 'umi';
import defaultSettings from '../config/defaultSettings';
import {currentUser as queryCurrentUser} from './services/ant-design-pro/api';
import {RequestConfig} from "@@/plugin-request/request";

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const NO_NEED_LOGIN_WHITE_LIST = ['/user/register', loginPath]

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
    loading: <PageLoading/>,
};


const authHeaderInterceptor = (url: string, options: RequestConfig) => {
    // @ts-ignore
    let user = JSON.parse(localStorage.getItem("user"))
    const authHeader = {'userId': user.id || 0,};
    return {
        url: `${url}`,
        options: {...options, interceptors: true, headers: authHeader},
    };
};

export const request: RequestConfig = {
    prefix: "/api",
    timeout: 1000,
    requestInterceptors: [authHeaderInterceptor],
    errorConfig: {
        adaptor: (resData) => {
            return {
                ...resData,
                errorMessage: resData.message,
            };
        },
    }
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>;
    currentUser?: API.User;
    loading?: boolean;
    fetchUserInfo?: () => Promise<API.User | undefined>;
}> {
    const fetchUserInfo = async () => {
        try {
            const msg = await queryCurrentUser();
            return msg.data;
        } catch (error) {
            history.push(loginPath);
        }
        return undefined;
    };
    // 如果不是登录页面，执行
    if (NO_NEED_LOGIN_WHITE_LIST.includes(history.location.pathname)) {
        return {
            fetchUserInfo,
            settings: defaultSettings,
        };
    }
    const currentUser = await fetchUserInfo();
    return {
        fetchUserInfo,
        currentUser,
        settings: defaultSettings,
    };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
    return {
        rightContentRender: () => <RightContent/>,
        disableContentMargin: false,
        waterMarkProps: {
            // @ts-ignore
            content: initialState?.currentUser?.userName,
        },
        footerRender: () => <Footer/>,
        onPageChange: () => {
            const {location} = history;
            if (NO_NEED_LOGIN_WHITE_LIST.includes(location.pathname)) {
                return
            }
            // 如果没有登录，重定向到 login
            // @ts-ignore
            if (initialState?.currentUser?.empty) {
                history.push(loginPath);
            }
        },
        links: isDev
            ? [
                // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
                //   <LinkOutlined />
                //   <span>OpenAPI 文档</span>
                // </Link>,
                // <Link to="/~docs" key="docs">
                //   <BookOutlined />
                //   <span>业务组件文档</span>
                // </Link>,
            ]
            : [],
        menuHeaderRender: undefined,
        // 自定义 403 页面
        // unAccessible: <div>unAccessible</div>,
        // 增加一个 loading 的状态
        childrenRender: (children, props) => {
            // if (initialState?.loading) return <PageLoading />;
            return (
                <>
                    {children}
                    {!props.location?.pathname?.includes('/login') && (
                        <SettingDrawer
                            disableUrlParams
                            enableDarkTheme
                            settings={initialState?.settings}
                            onSettingChange={(settings) => {
                                setInitialState((preInitialState) => ({
                                    ...preInitialState,
                                    settings,
                                }));
                            }}
                        />
                    )}
                </>
            );
        },
        ...initialState?.settings,
    };
};
