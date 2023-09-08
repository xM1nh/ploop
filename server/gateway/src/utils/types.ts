export type User = {
    id: number,
    username: string
    nickname: string,
    avatar_url: string,
    bio: string,
    followings: number,
    followers: number,
}

export type Spray = {
    id: number,
    url: string,
    cover_url: string,
    created_on: Date,
    user_id: number,
    caption: string,
    likes: number,
    edits: number,
    comments: number,
    saves: number,
    shares: number,
    view_permission: number,
    draw_permission: number,
    limited: boolean,
    deadline: string
}

export type Comment = {
    id: number,
    spray_id: number,
    user_id: number,
    created_on: Date,
    likes: number,
    description: string
}