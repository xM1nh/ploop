export type User = {
    id: number,
    username: string
    nickname: string,
    avatar_url: string,
    bio: string,
    followings: number,
    followers: number,
    isFollow: Follow | null
}

export type Spray = {
    id: number,
    url: string,
    cover_url: string,
    created_on: Date,
    user: User,
    caption: string,
    likes: number,
    edits: number,
    comments: number,
    saves: number,
    shares: number,
    view_permission: number,
    draw_permission: number,
    limited: boolean,
    deadline: Date,
    original_id: number,
    isLike: Like | null,
    isSave: Save | null
}

export type Comment = {
    id: number,
    spray: Spray,
    user: User,
    created_on: Date,
    likes: number,
    description: string
}

export type Like = {
    id: number,
    spray: Spray,
    user: User,
}

export type Save = {
    id: number,
    spray: Spray,
    user: User,
    created_on: Date
}

export type Follow = {
    id: number,
    follower_id: number,
    followee_id: number,
    created_on: Date
}