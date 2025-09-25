import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import style from "../styles/File.module.css";
import { FaUser } from "react-icons/fa";
import photoChecker from '../public/images/default.png';

const SimilarChannels = ({ similarChannels, category }) => {

    const handleImageError = (e) => {
      // Также устанавливаем src для элемента img вручную, чтобы избежать зацикливания
      e.target.src = photoChecker.src;
      // Отключаем обработчик, чтобы не было зацикливания, если default.png тоже не загрузится
      e.target.onerror = null;
    };

  return (
    <div>
      {similarChannels && similarChannels.map((channel, index) => {
        // Раскодируем Base64 изображение
        const avatarUrl = `data:image/jpeg;base64,${channel.avatarData}`;

        return (
          <Link href={`/channel/${channel.username}`} key={index}>
          <div key={index} className={style.card}>
            <div className={style.imageContainer}>
              <Image
                src={avatarUrl}
                alt={channel.title}
                width={80}
                height={80}
                className={style.image}
                onError={handleImageError}
              />
            </div>
            <div className={style.textContainer}>
              <h3 className={style.title}>{channel.title}</h3>
              <p className={style.description}>
                <FaUser /> Подписчики: {channel.subscribers?.toLocaleString() || 'N/A'}
              </p>
              {/* {channel.username && (
                <small className={style.username}>@{channel.username}</small>
              )} */}
            </div>
          </div></Link>
        );
      })}
    </div>
  );
};

export default SimilarChannels;