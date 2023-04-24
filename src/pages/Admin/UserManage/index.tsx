import {EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {Button, Dropdown, Image, Space, Tag} from 'antd';
import {useRef} from 'react';
import request from 'umi-request';
import {searchUsers} from "@/services/ant-design-pro/api";

export const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
};

type GithubIssueItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels: {
        name: string;
        color: string;
    }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
};

const columns: ProColumns<API.User>[] = [
    {
        dataIndex: 'id',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '用户名',
        dataIndex: 'userName',
        copyable: true,
    },
    {
        title: '用户账户',
        dataIndex: 'userAccount',
        copyable: true,
    },
    {
        title: '头像',
        dataIndex: 'avatarUrl',
        copyable: true,
        render: (_, record) => (
            <div>
                <Image src={record.avatarUrl} width={50}></Image>
            </div>
        ),
    },
    {
        title: '性别',
        dataIndex: 'gender',
        valueEnum: {
            0: {text: "男"},
            1: {
                text: '女',
            },
        },
    },
    {
        title: '电话',
        dataIndex: 'phone',
        copyable: true,
    },
    {
        title: '邮件',
        dataIndex: 'email',
        copyable: true,
    },
    {
        title: '状态',
        dataIndex: 'userStatus',
        valueEnum: {
            0: {text: "正常使用", status: "Success"},
            1: {
                text: '已被封禁',
                status: 'Error',
            },
        },
    },
    {
        title: '角色',
        dataIndex: 'userRole',
        valueEnum: {
            0: {text: "普通用户", status: "Default"},
            1: {
                text: '管理员',
                status: 'Success',
            },
        },
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        valueType: 'date',
    },
    // {
    //     disable: true,
    //     title: '状态',
    //     dataIndex: 'state',
    //     filters: true,
    //     onFilter: true,
    //     ellipsis: true,
    //     valueType: 'select',
    //     valueEnum: {
    //         all: { text: '超长'.repeat(50) },
    //         open: {
    //             text: '未解决',
    //             status: 'Error',
    //         },
    //         closed: {
    //             text: '已解决',
    //             status: 'Success',
    //             disabled: true,
    //         },
    //         processing: {
    //             text: '解决中',
    //             status: 'Processing',
    //         },
    //     },
    // },
    // {
    //     disable: true,
    //     title: '标签',
    //     dataIndex: 'labels',
    //     search: false,
    //     renderFormItem: (_, { defaultRender }) => {
    //         return defaultRender(_);
    //     },
    //     render: (_, record) => (
    //         <Space>
    //             {record.labels.map(({ name, color }) => (
    //                 <Tag color={color} key={name}>
    //                     {name}
    //                 </Tag>
    //             ))}
    //         </Space>
    //     ),
    // },
    // {
    //     title: '操作',
    //     valueType: 'option',
    //     key: 'option',
    //     render: (text, record, _, action) => [
    //         <a
    //             key="editable"
    //             onClick={() => {
    //                 action?.startEditable?.(record.id);
    //             }}
    //         >
    //             编辑
    //         </a>,
    //         <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
    //             查看
    //         </a>,
    //         <TableDropdown
    //             key="actionGroup"
    //             onSelect={() => action?.reload()}
    //             menus={[
    //                 { key: 'copy', name: '复制' },
    //                 { key: 'delete', name: '删除' },
    //             ]}
    //         />,
    //     ],
    // },
];

export default () => {
    const actionRef = useRef<ActionType>();
    return (
        <ProTable<API.User>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params = {}, sort, filter) => {
                const result = await searchUsers(params)
                return {
                    data: result.data
                }
            }}
            editable={{
                type: 'multiple',
            }}
            columnsState={{
                persistenceKey: 'pro-table-singe-demos',
                persistenceType: 'localStorage',
                onChange(value) {
                    console.log('value: ', value);
                },
            }}
            rowKey="id"
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            form={{
                // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                syncToUrl: (values, type) => {
                    if (type === 'get') {
                        return {
                            ...values,
                            created_at: [values.startTime, values.endTime],
                        };
                    }
                    return values;
                },
            }}
            pagination={{
                pageSize: 5,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="高级表格"
        />
    );
};