
import React from 'react';
import { HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon, DotsHorizontalIcon } from '../icons';
import { Post } from './types';

const tierBorderColor: Record<string, string> = {
    stephian: 'border-l-amber-500',
    peer: 'border-l-blue-500',
    expert: 'border-l-emerald-500',
};

const FeedPost: React.FC<{ post: Post; index: number }> = ({ post, index }) => {
    return (
        <div className="dark:bg-black bg-white border-b dark:border-gray-800 border-neutral-200 pb-6">
            {/* Header */}
            <div className="flex items-center py-3 px-1">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 mr-3">
                    <div className="p-[2px] rounded-full bg-white dark:bg-black">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                            <img src={post.userImage} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
                <div className="font-semibold text-sm dark:text-white text-black">{post.username}</div>
                <div className="text-gray-500 text-sm ml-2">• {post.hoursAgo}h</div>
                <button className="ml-auto text-gray-500 dark:text-gray-400"><DotsHorizontalIcon className="w-5 h-5" /></button>
            </div>

            {/* Image */}
            <div className="relative aspect-square dark:bg-gray-900 bg-neutral-100 rounded-sm overflow-hidden border dark:border-gray-800 border-neutral-200">
                <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
            </div>

            {/* Shoppable Course / Consult Banner */}
            {(post.courseId || post.consultantId) && (
                <div className={`border-l-4 ${post.mentorTier ? tierBorderColor[post.mentorTier] : 'border-l-blue-500'} bg-[#111] mx-1 mt-2 p-4 rounded-r-xl flex items-center justify-between`}>
                    <div className="flex-1">
                        {post.courseId ? (
                            <>
                                <p className="text-xs text-gray-400 mb-0.5">Active Course</p>
                                <p className="text-sm font-bold text-white">{post.courseName}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-gray-400 mb-0.5">Need help with this?</p>
                                <p className="text-sm font-bold text-white">Book {post.consultantName}</p>
                            </>
                        )}
                    </div>
                    <button className="shrink-0 ml-3 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                        {post.courseId ? 'Enroll' : 'Consult Now'}
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="py-3 px-1">
                <div className="flex items-center space-x-4 mb-3">
                    <button><HeartIcon className="w-6 h-6 dark:text-white text-black hover:text-gray-500 transition-colors" /></button>
                    <button><MessageCircleIcon className="w-6 h-6 dark:text-white text-black hover:text-gray-500 transition-colors" /></button>
                    <button><SendIcon className="w-6 h-6 dark:text-white text-black hover:text-gray-500 transition-colors -rotate-12" /></button>
                    <button className="ml-auto"><BookmarkIcon className="w-6 h-6 dark:text-white text-black hover:text-gray-500 transition-colors" /></button>
                </div>
                <div className="text-sm font-semibold dark:text-white text-black mb-1">{post.likes.toLocaleString()} likes</div>
                <p className="text-sm dark:text-white text-black">
                    <span className="font-semibold mr-2">{post.username}</span>
                    <span className="dark:text-gray-300 text-neutral-800">{post.caption}</span>
                </p>
                <p className="text-gray-500 text-sm mt-1 cursor-pointer">View all {post.comments} comments</p>
                <div className="flex items-center mt-2">
                    <input type="text" placeholder="Add a comment..." className="bg-transparent text-sm w-full focus:outline-none dark:text-white text-black placeholder-gray-500" />
                </div>
            </div>
        </div>
    );
};

export default FeedPost;
