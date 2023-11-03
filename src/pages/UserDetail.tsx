import { useParams } from 'react-router-dom';

import { ENV } from '@/utils/env';
import { useData } from '@/utils';
import { useCallback, useMemo, useState } from 'react';
import { UserDetailResponse } from '@/type';
import { Button, Icon, Loading } from '@/components/atoms';
import { Modal } from '@/components/molecules';

export const UserDetail: React.FC = () => {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState<string>('');
  const [imgDetail, setImgDetail] = useState<string>('');
  
  const { data, loading } = useData<UserDetailResponse>(`${ENV.API_URL}/v1/users/get/${params.uid}`);
  
  const user = useMemo(() => data?.user, [data?.user]);

  const handleFileDetail = useCallback((v: string | null | undefined) => {
    if(v) {
      return setIsModalOpen('video');
    }

    return alert('user doesn\'t have video files');
  }, []);

  const handleImageDetail = useCallback((v: string | null | undefined) => {
    setIsModalOpen('image');

    if(v) {
      setImgDetail(v);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen('');
  }, []);

  if(loading) {
    return <Loading />;
  }

  return (
    <div className="mt-5 grid md:grid-cols-2 gap-2">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center space-y-3 mb-5">
          <img
            src={user?.images[0]}
            alt={user?.name}
            className="w-32 h-32 mx-auto rounded-full object-cover bg-gray-200"
          />
          <h1 className="text-3xl font-semibold mt-4">{user?.name || user?.email.split('@')[0] || 'Name -'}</h1>
          <p className="text-gray-500 text-sm mt-2">{user?.email || 'Email -'}</p>
        </div>
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">{user?.isVerified === 'false' ? <Icon type="solid" name="circle-x" className="text-red-700"/> : <Icon type="solid" name="badge-check" className="text-primary"/>} Is verified</p>
          <p className="text-gray-500 text-sm">{user?.isPaid ? <Icon name="badge-check" type="solid" className="text-primary"/> : <Icon name="circle-x" type="solid" className="text-red-700"/>} Is paid</p>
          <p className="text-gray-500 text-sm">{user?.openQuestionCompleted ? <Icon name="badge-check" type="solid" className="text-primary"/> : <Icon name="circle-x" type="solid" className="text-red-700"/>} Open question completed</p>
          <p className="text-gray-500 text-sm">{user?.questionCompleted ? <Icon name="badge-check" type="solid" className="text-primary"/> : <Icon name="circle-x" type="solid" className="text-red-700"/>} Question completed</p>
          
          <div className="w-full">
            <div className="font-bold mb-3">
              Audio
            </div>
            {user?.audioUrl ? (
              <audio src={user?.audioUrl} className="max-h-full" controls/>
            ) : <p className="text-red-700">User audio is unavailable at the moment</p>}
          </div>

          <div>
            <div className="font-bold mb-3">
              Video
            </div>
            {user?.partnerVideo ? (
              <Button className="text-gray-500 gap-2 mt-4" onClick={() => handleFileDetail(user?.partnerVideo)}>
                <Icon type="solid" name="video" className="text-white"/> See Video
              </Button>
            ) : <p className="text-red-700">User video is unavailable at the moment</p>}
          </div>

        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md space-y-5">
        <div>
          <div className="font-bold mb-2">Images</div>
          <div className="flex flex-wrap">
            {user?.images.map((e:string, idx:number) => (
              <div key={idx} className="relative cursor-pointer mr-2 overflow-hidden" onClick={() => handleImageDetail(e)}>
                <div className="absolute w-full h-full hover:bg-gray-200/[.4] bottom-1 rounded-lg"></div>
                <img
                  src={e}
                  alt={e}
                  className="w-32 h-32 mx-auto rounded-lg mb-2 object-cover bg-gray-200"
                />
              </div>
            ))}
            {!user?.images[0] && (<p className="text-red-700">User image is unavailable at the moment</p>)}
          </div>
        </div>
        <div>
          <div className="font-bold mb-2">User identity</div>
          <div className="flex flex-wrap items-start">
            {user?.identity.map((e:string, idx:number) => (
              <div key={idx}>
                <img
                  src={e}
                  alt={e}
                  className="w-full rounded-lg mb-2 object-cover bg-gray-200"
                />
              </div>
            ))}
            {!user?.identity[0] && (<p className="text-red-700">User identity is unavailable at the moment</p>)}
          </div>
        </div>
      </div>
      {isModalOpen === 'video' && (
        <Modal isOpen={isModalOpen === 'video'} onClose={closeModal}>
          {isModalOpen && (
            <iframe
              className="modal__video-style"
              loading="lazy"
              width="800"
              height="500"
              src={user?.partnerVideo}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </Modal>
      )}
      {isModalOpen === 'image' && (
        <Modal isOpen={isModalOpen === 'image'} onClose={closeModal}>
          <div className="w-full h-full max-h-[80vh] flex items-center">
            <img src={imgDetail} className="h-[80vh]" alt={imgDetail} />
          </div>
        </Modal>
      )}
    </div>
  );
};
