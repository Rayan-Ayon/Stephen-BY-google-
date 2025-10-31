import React from 'react';
import { motion } from 'framer-motion';
import { YoutubeIcon, TiktokIcon, InstagramIcon, HeartIcon, MessageCircleIcon, ShareIcon, DotsHorizontalIcon } from './icons';

const Post = ({ index }: { index: number }) => {
    const icons = [<YoutubeIcon className="w-5 h-5 text-red-500"/>, <TiktokIcon className="w-5 h-5 text-white"/>, <InstagramIcon className="w-5 h-5 text-pink-500"/>];
    
    return (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl mb-6">
            <div className="flex items-center p-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                <div className="font-semibold text-white">user_name</div>
                <div className="ml-auto text-gray-400">
                    {icons[index % 3]}
                </div>
            </div>
            <div className="w-full aspect-[9/16] bg-gray-800 max-h-[75vh]">
                 <img src={`https://picsum.photos/seed/${index+30}/500/888`} alt="Post content" className="w-full h-full object-cover"/>
            </div>
            <div className="p-4">
                <div className="flex items-center space-x-4 mb-3">
                    <HeartIcon className="w-6 h-6 cursor-pointer hover:text-red-500"/>
                    <MessageCircleIcon className="w-6 h-6 cursor-pointer hover:text-white"/>
                    <ShareIcon className="w-6 h-6 cursor-pointer hover:text-white"/>
                    <div className="ml-auto">
                        <DotsHorizontalIcon className="w-6 h-6 cursor-pointer"/>
                    </div>
                </div>
                <p className="text-sm font-semibold text-white">1,234 likes</p>
                <p className="text-sm mt-2">
                    <span className="font-semibold text-white">user_name</span>
                    <span className="text-gray-300 ml-2">This is a caption for the post. Learning and sharing knowledge! #AI #EdTech</span>
                </p>
                 <p className="text-xs text-gray-500 mt-2 cursor-pointer">View all 42 comments</p>
            </div>
        </div>
    );
}

const EdgramView = () => {
    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto stephen-bg items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-lg">
                {/* Profile Header Placeholder */}
                <div className="flex items-center p-4 mb-8">
                    <div className="w-24 h-24 bg-gray-700 rounded-full mr-8"></div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Lora', serif" }}>Stephen_AI</h2>
                        <div className="flex space-x-6">
                            <div><span className="font-bold text-white">102</span> <span className="text-gray-400">Posts</span></div>
                            <div><span className="font-bold text-white">5.1k</span> <span className="text-gray-400">Connections</span></div>
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div>
                    {Array(5).fill(0).map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Post index={index} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EdgramView;