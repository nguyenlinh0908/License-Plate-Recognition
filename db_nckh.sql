-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th4 07, 2022 lúc 11:59 AM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `db_nckh`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_bienso`
--

CREATE TABLE `tbl_bienso` (
  `PK_iMaBien` int(11) NOT NULL,
  `sBienSo` varchar(32) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_bienso`
--

INSERT INTO `tbl_bienso` (`PK_iMaBien`, `sBienSo`) VALUES
(223, '76A07676'),
(7497, '51F44614');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_loaive`
--

CREATE TABLE `tbl_loaive` (
  `PK_iLoaiVe` int(11) NOT NULL,
  `sLoaiVe` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `fGia` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_loaive`
--

INSERT INTO `tbl_loaive` (`PK_iLoaiVe`, `sLoaiVe`, `fGia`) VALUES
(1, 'xe đạp', 2000),
(2, 'xe máy', 5000),
(3, 'ô tô', 10000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_vexe`
--

CREATE TABLE `tbl_vexe` (
  `PK_iMaVe` int(11) NOT NULL,
  `sQr` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `sThoiGian` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `bTrangThai` tinyint(1) NOT NULL,
  `FK_iLoaiVe` int(11) NOT NULL,
  `FK_iMaBien` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_vexe`
--

INSERT INTO `tbl_vexe` (`PK_iMaVe`, `sQr`, `sThoiGian`, `bTrangThai`, `FK_iLoaiVe`, `FK_iMaBien`) VALUES
(8256, './tickets/8256.png', '07/04/2022', 1, 1, 7497);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `tbl_bienso`
--
ALTER TABLE `tbl_bienso`
  ADD PRIMARY KEY (`PK_iMaBien`);

--
-- Chỉ mục cho bảng `tbl_loaive`
--
ALTER TABLE `tbl_loaive`
  ADD PRIMARY KEY (`PK_iLoaiVe`);

--
-- Chỉ mục cho bảng `tbl_vexe`
--
ALTER TABLE `tbl_vexe`
  ADD PRIMARY KEY (`PK_iMaVe`),
  ADD KEY `FK_iMaBien` (`FK_iMaBien`),
  ADD KEY `FK_iLoaiVe` (`FK_iLoaiVe`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `tbl_vexe`
--
ALTER TABLE `tbl_vexe`
  ADD CONSTRAINT `FK_iLoaiVe` FOREIGN KEY (`FK_iLoaiVe`) REFERENCES `tbl_loaive` (`PK_iLoaiVe`),
  ADD CONSTRAINT `FK_iMaBien` FOREIGN KEY (`FK_iMaBien`) REFERENCES `tbl_bienso` (`PK_iMaBien`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
