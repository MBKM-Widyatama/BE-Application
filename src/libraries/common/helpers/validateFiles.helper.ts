import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description Handle Validate File Image
 * @param {Object} _req
 * @param {Object} file
 * @param {Function} callback
 *
 * @returns {void} callback
 */
export const validateFileImage = (_req, file, callback): void => {
  if (!file.originalname.match(/\.(png|webp)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed! (png, webp)'),
      false,
    );
  }
  callback(null, true);
};

/**
 * @description Handle Validate File PDF
 * @param {Object} _req
 * @param {Object} file
 * @param {Function} callback
 *
 * @returns {void} callback
 */
export const pdfFileFilter = (_req, file, callback) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(
      new BadRequestException('Only PDF files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

/**
 * @description Handle Validate File Image/PDF
 * @param {Object} _req
 * @param {Object} file
 * @param {Function} callback
 *
 * @returns {void} callback
 */
export const imagePdfFileFilter = (_req, file, callback) => {
  if (!file.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
    return callback(
      new BadRequestException('Only PDF/Image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

/**
 * @description Handle Generate File Name
 * @param {File} file
 * @param {Function} callback
 *
 * @returns {String}
 */
export const generateFileName = (file: any): string => {
  // const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const timestamp = Math.floor(Date.now() / 1000);

  return `${uuidv4()}-${timestamp}${fileExtName}`;
};
