import { FileMetadata } from '../../entities/dataset.entity';

export class UpdateDatasetDto {
  readonly owner?: string;
  readonly call?: string;
  readonly description?: string;
  readonly tags?: string[];
  readonly file?: FileMetadata;
}
