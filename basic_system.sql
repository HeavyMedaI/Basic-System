-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 11 Kas 2014, 13:28:32
-- Sunucu sürümü: 5.6.17
-- PHP Sürümü: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Veritabanı: `basic_system`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `anasayfa_galeri`
--

CREATE TABLE IF NOT EXISTS `anasayfa_galeri` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `index` int(150) NOT NULL,
  `src` varchar(255) NOT NULL DEFAULT '_assets/images/gallery/800x504.gif',
  `active` int(10) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `etkinlikler`
--

CREATE TABLE IF NOT EXISTS `etkinlikler` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `date` datetime NOT NULL,
  `address` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Tablo döküm verisi `etkinlikler`
--

INSERT INTO `etkinlikler` (`id`, `name`, `text`, `date`, `address`, `active`) VALUES
(1, 'Test Etkinlik', 'Test Etkinlik', '2014-11-26 12:26:35', 'Test Etkinlik', 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `icerikler`
--

CREATE TABLE IF NOT EXISTS `icerikler` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `active` int(10) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Tablo döküm verisi `icerikler`
--

INSERT INTO `icerikler` (`id`, `name`, `text`, `active`) VALUES
(1, 'hakkimizda', '<p>Suspendisse sed sollicitudin nisl, at dignissim libero. Sed porta tincidunt ipsum, vel volutpat. <br>\r\n                    <br>\r\n                    Nunc ut fringilla urna. Cras vel adipiscing ipsum. Integer dignissim nisl eu lacus interdum facilisis. Aliquam erat volutpat. Nulla semper vitae felis vitae dapibus. </p>', 1),
(2, 'genel_aciklama', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse interdum eleifend augue, quis rhoncus purus fermentum. In hendrerit risus arcu, in eleifend metus dapibus varius. Nulla dolor sapien, laoreet vel tincidunt non, egestas non justo. Phasellus et mattis lectus, et gravida urna.</p>\r\n                <p><img src="_assets/images/tab/197x147.gif" alt="food" class="pull-right"> Donec pretium sem non tincidunt iaculis. Nunc at pharetra eros, a varius leo. Mauris id hendrerit justo. Mauris egestas magna vitae nisi ultricies semper. Nam vitae suscipit magna. Nam et felis nulla. Ut nec magna tortor. Nulla dolor sapien, laoreet vel tincidunt non, egestas non justo. </p>', 1),
(3, 'ekstra', 'Aa vestibulum risus mattis vitae. Aliquam vitae varius elit, non facilisis massa. Vestibulum luctus diam mollis gravida bibendum. Aliquam mattis velit dolor, sit amet semper erat auctor vel. Integer auctor in dui ac vehicula. Integer fermentum nunc ut arcu feugiat, nec placerat nunc tincidunt. Pellentesque in massa eu augue placerat cursus sed quis magna.', 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `resimler`
--

CREATE TABLE IF NOT EXISTS `resimler` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `ref_id` int(255) NOT NULL,
  `src` varchar(255) NOT NULL DEFAULT '_assets/images/rooms/slider/750x481.gif',
  `alt` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `rel` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Tablo döküm verisi `resimler`
--

INSERT INTO `resimler` (`id`, `ref_id`, `src`, `alt`, `title`, `type`, `rel`) VALUES
(1, 1, '_assets/images/gallery/223d83f9dead1f1c5d25148a487ce688.png', 'Deneme Resimli Villa', 'Deneme Resimli Villa', 'villa', 0),
(2, 1, '_assets/images/gallery/1cace577f6b90f1d581726a0e772738f.jpg', 'Deneme Resimli Villa', 'Deneme Resimli Villa', 'villa', 0),
(3, 1, '_assets/images/gallery/5d772c8dac1533bf1b26c645fd32d1bf.png', 'Deneme Resimli Villa', 'Deneme Resimli Villa', 'villa', 1),
(4, 1, '_assets/images/gallery/fc149a647cae09ad84e95a4d3ae975e7.png', 'Deneme Resimli Villa', 'Deneme Resimli Villa', 'villa', 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `rezervasyon`
--

CREATE TABLE IF NOT EXISTS `rezervasyon` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `villa_id` int(255) NOT NULL,
  `email` varchar(155) NOT NULL,
  `checkin` datetime NOT NULL,
  `checkout` datetime NOT NULL,
  `adults` int(150) NOT NULL DEFAULT '1',
  `children` int(150) NOT NULL DEFAULT '0',
  `approved` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Tablo döküm verisi `rezervasyon`
--

INSERT INTO `rezervasyon` (`id`, `villa_id`, `email`, `checkin`, `checkout`, `adults`, `children`, `approved`) VALUES
(3, 1, 'musaatalay@mail.com.tr', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 0, 1),
(5, 17, 'musa@admin', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 0, 0),
(6, 1, 'byhackro@gmail.com', '2014-11-12 00:00:00', '2014-11-28 00:00:00', 2, 2, 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(155) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `mode` int(155) NOT NULL DEFAULT '0',
  `avatar` varchar(255) NOT NULL DEFAULT 'admin/_assets/img/avatars/alex.jpg',
  `active` int(10) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`,`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `phone`, `firstname`, `lastname`, `mode`, `avatar`, `active`) VALUES
(1, 'admin', '66b65567cedbc743bda3417fb813b9ba', 'admin@admin', '', 'Musa', 'ATALAY', 1, 'admin/_assets/img/avatars/alex.jpg', 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `villa`
--

CREATE TABLE IF NOT EXISTS `villa` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `gecelik_fiyat` varchar(255) NOT NULL DEFAULT '0.00',
  `wifi` int(10) NOT NULL DEFAULT '0',
  `havuz` int(10) NOT NULL DEFAULT '0',
  `uydu` int(10) NOT NULL DEFAULT '0',
  `sicak_su` int(10) NOT NULL DEFAULT '0',
  `lcd_tv` int(10) NOT NULL DEFAULT '0',
  `yatak_sayisi` varchar(10) NOT NULL DEFAULT '2',
  `jakuzi` int(10) NOT NULL DEFAULT '0',
  `durumu` int(10) NOT NULL DEFAULT '0',
  `active` int(10) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Tablo döküm verisi `villa`
--

INSERT INTO `villa` (`id`, `name`, `description`, `thumbnail`, `gecelik_fiyat`, `wifi`, `havuz`, `uydu`, `sicak_su`, `lcd_tv`, `yatak_sayisi`, `jakuzi`, `durumu`, `active`) VALUES
(1, 'Deneme Resimli Villa', '', '_assets/images/gallery/f8f6934f1e7e3117e05dc8abd1b0ff7c.jpg', '300', 1, 1, 1, 1, 1, '3', 1, 0, 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
