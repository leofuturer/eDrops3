terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-west-1"
}

# Create EC2 instance for web server
resource "aws_instance" "web" {
  ami               = "ami-0f8e81a3da6e2510a"
  instance_type     = "t3a.micro"
  availability_zone = "us-west-1a"

  tags = {
    Name = "edrop-v3-ec2"
  }
}

# Create RDS instance for database
resource "aws_db_instance" "db" {
  allocated_storage    = 25
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0"
  auto_minor_version_upgrade = true
  instance_class       = "db.t2.micro"
  name                 = "edrop_user_management"
  username             = "admin"
  password             = ""
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
}

# Create S3 bucket for storage
resource "aws_s3_bucket" "storage" {
  bucket = "edrop-v3-s3"
  acl    = "private"
}

# TODO: Setup VPC and Elastic IP
