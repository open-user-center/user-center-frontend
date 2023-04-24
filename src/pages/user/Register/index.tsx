import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProFormText,
} from '@ant-design/pro-components';
import {message, Tabs} from 'antd';
import React, {useState} from 'react';
import {history} from 'umi';
import styles from './index.less';
const Register: React.FC = () => {
    const [userLoginState] = useState<API.LoginResult>({});
    const [type, setType] = useState<string>('account');
    const handleSubmit = async (values: API.RegisterParams) => {
        const {userPassword, checkPassword} = values;
        if (userPassword !== checkPassword){
            message.error("两次输入密码不一致");
            return
        }
        try {
            // 注册
            const result = await register({
                ...values,
            });

            if (result.data && result.data["id"] > 0) {
                const defaultLoginSuccessMessage = '注册成功！';
                message.success(defaultLoginSuccessMessage);
                /** 此方法会跳转到 redirect 参数所在的位置 */
                if (!history) return;
                const {query} = history.location;
                history.push({
                    pathname: "/user/login",
                    query
                });
                return;
            }else{
                message.error("注册异常");
            }
        } catch (error) {
        }
    };
    const {status, type: loginType} = userLoginState;
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <LoginForm
                    submitter={{searchConfig:{submitText: "注册"}}}
                    logo={<img alt="logo" src="/logo.svg"/>}
                    title="用户开放中心"
                    subTitle={<>基于Kratos编写的用户开放中心</>}
                    initialValues={{
                        autoLogin: true,
                    }}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.RegisterParams);
                    }}
                >
                    <Tabs activeKey={type} onChange={setType}>
                        <Tabs.TabPane key="account" tab={'账号密码注册'}/>
                    </Tabs>

                    {status === 'error' && loginType === 'account' && (
                        <LoginMessage content={'错误的账号和密码'}/>
                    )}
                    {type === 'account' && (
                        <>
                            <ProFormText
                                name="userAccount"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder="请输入账号"
                                rules={[
                                    {
                                        required: true,
                                        message: '账号是必填项！',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="userPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder="请输入密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        type: "string",
                                        message: "长度不能小于8"
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="checkPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder="请再次输入密码"
                                rules={[
                                    {
                                        required: true,
                                        message: '确认密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        type: "string",
                                        message: "长度不能小于8"
                                    },
                                ]}
                            />
                        </>
                    )}
                </LoginForm>
            </div>
            <Footer/>
        </div>
    );
};
export default Register;
